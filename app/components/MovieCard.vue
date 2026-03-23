<script setup lang="ts">
import { computed } from 'vue';
import type { Movie } from '../types/movie'

// defineProps dit à Vue ce que ce composant reçoit depuis son parent.
const props = defineProps<{
  movie: Movie
}>()

// Construit l'URL complète de l'affiche à partir du chemin partiel retourné par TMDB.
// w500 = largeur de 500px suffisant pour une carte
const posterUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : '/placeholder.jpg' // image par défaut si pas d'affiche
)

// Formate la note sur 10 avec une décimale ex: 8.5
const rating = computed(() => props.movie.vote_average.toFixed(1))

// Extrait l'année depuis la date "2010-07-16" → "2010"
const year = computed(() => props.movie.release_date?.split('-')[0] ?? '—')
</script>

<template>
  <NuxtLink :to="`/movies/${movie.id}`">
  <article
    class="group relative overflow-hidden rounded-xl bg-gray-900 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <!-- Affiche du film -->
    <div class="aspect-[2/3] overflow-hidden">
      <img
        :src="posterUrl"
        :alt="movie.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <!-- Informations -->
    <div class="p-3">
      <!-- Titre -->
      <h3 class="truncate text-sm font-semibold text-white">
        {{ movie.title }}
      </h3>

      <!-- Année et note -->
      <div class="mt-1 flex items-center justify-between text-xs text-gray-400">
        <span>{{ year }}</span>

        <!-- Note avec étoile -->
        <span class="flex items-center gap-1">
          <Icon name="heroicons:star-solid" class="h-3 w-3 text-yellow-400" />
          {{ rating }}
        </span>
      </div>
    </div>
  </article>
  </NuxtLink>
</template>