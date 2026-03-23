<script setup lang="ts">
// Ce composant ne reçoit aucune prop — il affiche juste une animation de chargement
// qui reproduit la structure visuelle de MovieCard
</script>

<template>
  <article class="overflow-hidden rounded-xl bg-gray-900">
    <!-- Placeholder de l'affiche -->
    <div class="aspect-[2/3] animate-pulse bg-gray-700" />

    <!-- Placeholder des informations -->
    <div class="p-3 space-y-2">
      <div class="animate-pulse h-3 w-3/4 rounded bg-gray-700" />
      <div class="animate-pulse h-3 w-1/2 rounded bg-gray-700" />
    </div>
  </article>
</template>