<script setup lang="ts">
</script>

<template>
  <NuxtPage :transition="{
    name: 'page',
    mode: 'out-in'
  }" />
</template>

<style lang="scss">
/* Transition entre les pages */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Animation d'apparition des cartes */
.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>