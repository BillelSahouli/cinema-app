<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMovieStore } from '../../stores/movieStore'
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

// On récupère le store c'est lui qui gère toute la logique
const movieStore = useMovieStore()

const { t } = useI18n()

// Référence vers l'élément sentinel en bas de page
// Quand cet élément devient visible, on charge plus de films
const sentinel = ref<HTMLElement | null>(null)

// useDebounceFn attend que l'utilisateur arrête de taper pendant 400ms
// avant d'appeler setSearchQuery évite un appel API à chaque frappe
const debouncedSearch = useDebounceFn((value: string) => {
  movieStore.setSearchQuery(value)
}, 400)

function onSearch(event: Event) {
  const input = event.target as HTMLInputElement
  debouncedSearch(input.value)
}

// useIntersectionObserver observe si "sentinel" est visible dans le viewport
// Quand il l'est, on charge la page suivante
useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && !movieStore.isLoading && movieStore.hasMore) {
    movieStore.loadMore()
  }
})

// Charge les films au montage de la page
onMounted(() => {
  movieStore.loadMovies()
})
</script>

<template>
  <main class="min-h-screen bg-gray-950 px-6 py-10">
    <!-- En-tête -->
    <div class="mb-8 flex flex-col items-center gap-4">
      <h1 class="text-3xl font-bold text-white">
        {{ t('home.title') }}
      </h1>

      <!-- Barre de recherche -->
      <div class="relative w-full max-w-md">
        <Icon
          name="heroicons:magnifying-glass"
          class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          :placeholder="t('home.search_placeholder')"
          class="w-full rounded-xl bg-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearch($event)"
        />
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="movieStore.error" class="text-center text-red-400">
      {{ t('common.error') }}
    </p>

    <!-- Grille de films -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <!-- Films chargés -->
      <MovieCard
        v-for="(movie, index) in movieStore.movies"
        :key="movie.id"
        :movie="movie"
        :index="index"
      />

      <!-- Skeletons pendant le chargement -->
      <template v-if="movieStore.isLoading">
        <MovieCardSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
      </template>
    </div>

    <!-- Sentinel élément invisible en bas de page -->
    <!-- Quand il devient visible, useIntersectionObserver déclenche loadMore -->
    <div ref="sentinel" class="h-10" />
  </main>
</template>