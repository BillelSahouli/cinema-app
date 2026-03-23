<script setup lang="ts">
import { useCommentStore } from '../../stores/commentStore'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  movieId: number
}>()

const commentStore = useCommentStore()

// On calcule les commentaires du film en cours
const comments = computed(() =>
  commentStore.getCommentsByMovie(props.movieId)
)
</script>

<template>
  <div>
    <h2 class="mb-6 text-xl font-semibold text-white">{{ t('comments.list_title') }}</h2>

    <!-- Aucun commentaire -->
    <p v-if="comments.length === 0" class="text-gray-400">
      {{ t('comments.no_comments') }}
    </p>

    <!-- Liste -->
    <div class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-xl bg-gray-800 p-4"
      >
        <!-- En-tête -->
        <div class="mb-2 flex items-center justify-between">
          <span class="font-semibold text-white">{{ comment.username }}</span>
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1 text-sm text-yellow-400">
              <Icon name="heroicons:star-solid" class="h-4 w-4" />
              {{ comment.rating }}/10
            </span>
            <span class="text-xs text-gray-400">
              {{ new Date(comment.createdAt).toLocaleDateString('fr-FR') }}
            </span>
          </div>
        </div>

        <!-- Message -->
        <p class="text-sm leading-relaxed text-gray-300">{{ comment.message }}</p>
      </div>
    </div>
  </div>
</template>