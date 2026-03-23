<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useMovieStore } from '../../stores/movieStore'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'

// On récupère le store c'est lui qui gère toute la logique
const movieStore = useMovieStore()

const { t } = useI18n()

// Référence vers l'élément sentinel en bas de page
// Quand cet élément devient visible, on charge plus de films
const sentinel = ref<HTMLElement | null>(null)

// useIntersectionObserver observe si "sentinel" est visible dans le viewport
// Quand il l'est, on charge la page suivante
useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && !movieStore.isLoading && movieStore.hasMore) {
    movieStore.loadMore()
  }
})

// Sauvegarde la position du scroll avant de quitter la page
onBeforeRouteLeave(() => {
  sessionStorage.setItem('scroll-position', String(window.scrollY))
})

onMounted(() => {
  // Ne recharge que si la liste est vide
  movieStore.loadMovies()

  const savedPosition = sessionStorage.getItem('scroll-position')
  if (savedPosition) {
    nextTick(() => {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition))
        sessionStorage.removeItem('scroll-position')
      }, 100)
    })
  }
})
</script>

<template>
  <main class="min-h-screen bg-gray-950 px-6 pt-24 pb-10">

    <!-- Message d'erreur -->
    <p v-if="movieStore.error" class="text-center text-red-400">
      {{ t('common.error') }}
    </p>

    <!-- Grille de films -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <MovieCard
        v-for="(movie, index) in movieStore.movies"
        :key="movie.id"
        :movie="movie"
        :index="index"
      />

      <template v-if="movieStore.isLoading">
        <MovieCardSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
      </template>
    </div>

    <div ref="sentinel" class="h-10" />
  </main>
</template>