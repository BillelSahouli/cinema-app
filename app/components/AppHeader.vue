<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMovieStore } from '../../stores/movieStore'
import { useDebounceFn } from '@vueuse/core'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const movieStore = useMovieStore()

const debouncedSearch = useDebounceFn((value: string) => {
  movieStore.setSearchQuery(value)
}, 400)

function onSearch(event: Event) {
  const input = event.target as HTMLInputElement
  debouncedSearch(input.value)
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

      <!-- Logo -->
      <NuxtLink to="/" class="text-xl font-bold text-white">
        {{ t('home.title') }}
      </NuxtLink>

      <!-- Barre de recherche — uniquement visible sur la page liste -->
      <div v-if="String(route.name).startsWith('index')" class="relative w-full max-w-md mx-4">
        <Icon
          name="heroicons:magnifying-glass"
          class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          :placeholder="t('home.search_placeholder')"
          class="w-full rounded-xl bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearch($event)"
        />
      </div>

    </div>
  </header>
</template>