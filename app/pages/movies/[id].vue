<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { getMovieDetail } from '../../../services/tmdb'
import type { MovieDetail } from '../../../types/movie'


// useRoute() donne accès aux paramètres de l'URL
// Si l'URL est /movies/27205, route.params.id vaut "27205"
const route = useRoute()

const movie = ref<MovieDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Construit l'URL complète de l'affiche
const posterUrl = computed(() =>
  movie.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : 'https://placehold.co/500x750/1f2937/6b7280?text=No+Poster'
)

// Construit l'URL de l'image de fond plus grande résolution pour le backdrop
const backdropUrl = computed(() =>
  movie.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.value.backdrop_path}`
    : null
)

// Formate la durée "132" → "2h 12min"
const runtime = computed(() => {
  if (!movie.value?.runtime) return null
  const hours = Math.floor(movie.value.runtime / 60)
  const minutes = movie.value.runtime % 60
  return `${hours}h ${minutes}min`
})

// Formate la note sur 10 avec une décimale
const rating = computed(() => movie.value?.vote_average.toFixed(1))

onMounted(async () => {
  try {
    // route.params.id est une string on la convertit en number avec Number()
    const id = Number(route.params.id)
    movie.value = await getMovieDetail(id)
  }
  catch {
    error.value = 'Impossible de charger ce film.'
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="min-h-screen bg-gray-950 text-white">

    <!-- Bouton retour -->
    <div class="px-6 py-4">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-400 transition hover:text-white"
      >
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        Retour
      </NuxtLink>
    </div>

    <!-- Erreur -->
    <p v-if="error" class="text-center text-red-400">{{ error }}</p>

    <!-- Skeleton pendant le chargement -->
    <div v-else-if="isLoading" class="px-6 py-4 space-y-4">
      <div class="animate-pulse h-64 w-full rounded-xl bg-gray-800" />
      <div class="animate-pulse h-8 w-1/2 rounded bg-gray-800" />
      <div class="animate-pulse h-4 w-full rounded bg-gray-800" />
      <div class="animate-pulse h-4 w-3/4 rounded bg-gray-800" />
    </div>

    <!-- Contenu du film -->
    <div v-else-if="movie">

      <!-- Image de fond -->
      <div
        v-if="backdropUrl"
        class="relative h-72 w-full overflow-hidden"
      >
        <img
          :src="backdropUrl"
          :alt="movie.title"
          class="h-full w-full object-cover opacity-40"
        />
        <!-- Dégradé pour que le texte reste lisible -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      <!-- Informations principales -->
      <div class="px-6 py-8 flex gap-8">

        <!-- Affiche -->
        <img
          :src="posterUrl"
          :alt="movie.title"
          class="hidden md:block w-48 flex-shrink-0 rounded-xl shadow-2xl"
        />

        <!-- Détails -->
        <div class="flex flex-col gap-4">

          <!-- Titre et tagline -->
          <div>
            <h1 class="text-3xl font-bold">{{ movie.title }}</h1>
            <p v-if="movie.tagline" class="mt-1 text-gray-400 italic">
              {{ movie.tagline }}
            </p>
          </div>

          <!-- Métadonnées -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-300">

            <!-- Note TMDB -->
            <span class="flex items-center gap-1">
              <Icon name="heroicons:star-solid" class="h-4 w-4 text-yellow-400" />
              {{ rating }} ({{ movie.vote_count.toLocaleString() }} votes)
            </span>

            <!-- Durée -->
            <span v-if="runtime">{{ runtime }}</span>

            <!-- Réalisateur -->
            <span v-if="movie.director">
              Réalisé par <strong>{{ movie.director }}</strong>
            </span>
          </div>

          <!-- Genres -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in movie.genres"
              :key="genre.id"
              class="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
            >
              {{ genre.name }}
            </span>
          </div>

          <!-- Synopsis -->
          <p class="text-gray-300 leading-relaxed max-w-2xl">
            {{ movie.overview }}
          </p>
        </div>
      </div>

      <!-- Casting -->
      <div class="px-6 pb-8">
        <h2 class="mb-4 text-xl font-semibold">Têtes d'affiche</h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div
            v-for="member in movie.cast"
            :key="member.id"
            class="flex-shrink-0 w-24 text-center"
          >
            <img
              :src="member.profile_path
                ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                : 'https://placehold.co/185x278/1f2937/6b7280?text=?'"
              :alt="member.name"
              class="h-24 w-24 rounded-full object-cover mx-auto"
            />
            <p class="mt-2 text-xs font-medium truncate">{{ member.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ member.character }}</p>
          </div>
        </div>
      </div>
    <!-- Commentaires -->
    <div class="px-6 pb-12 space-y-8">
        <CommentForm :movie-id="movie.id" />
        <CommentList :movie-id="movie.id" />
    </div>
    </div>
  </main>
</template>