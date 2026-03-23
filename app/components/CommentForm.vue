<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, alpha, between, helpers } from '@vuelidate/validators'
import { useCommentStore } from '../../stores/commentStore'
import { useI18n } from 'vue-i18n'
import type { CommentForm } from '../../types/comment'
import { reactive } from 'vue'

const { t } = useI18n()

// Le composant reçoit l'id du film depuis la page détail
const props = defineProps<{
  movieId: number
}>()

const commentStore = useCommentStore()

// État du formulaire correspond exactement à notre interface CommentForm
const form = reactive<CommentForm>({
  username: '',
  message: '',
  rating: null,
})

// Règles de validation correspondent exactement au cahier des charges
const rules = {
  username: {
    required,
    alpha,                    // que des lettres
    minLength: minLength(3),
    maxLength: maxLength(50),
  },
  message: {
    required,
    alphaNumExtended: helpers.withMessage(
      t('comments.errors.message_invalid'),
      helpers.regex(/^[a-zA-ZÀ-ÿ0-9\s.,!?'"-]+$/)
    ),
    minLength: minLength(3),
    maxLength: maxLength(500),
  },
  rating: {
    required,
    between: between(1, 10),
  },
}

// v$ c'est l'instance Vuelidate elle expose l'état de validation de chaque champ
const v$ = useVuelidate(rules, form)

// Soumission du formulaire
async function onSubmit() {
  // Déclenche la validation de tous les champs
  const isValid = await v$.value.$validate()

  // Si au moins un champ est invalide, on ne soumet pas
  if (!isValid) return

  commentStore.addComment(props.movieId, form)

  // Réinitialise le formulaire après soumission
  form.username = ''
  form.message = ''
  form.rating = null

  // Réinitialise l'état de validation efface les messages d'erreur
  v$.value.$reset()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">

    <!-- Username -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-300">
        {{ t('comments.username') }}
      </label>
      <input
        v-model="form.username"
        type="text"
        :placeholder="t('comments.username_placeholder')"
        class="w-full rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:ring-2"
        :class="v$.username.$error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'"
      />
      <!-- Messages d'erreur -->
      <p v-if="v$.username.required.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.username_required') }}
      </p>
      <p v-else-if="v$.username.alpha.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.username_alpha') }}
      </p>
      <p v-else-if="v$.username.minLength.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.username_min') }}
      </p>
      <p v-else-if="v$.username.maxLength.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.username_max') }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-300">
        {{ t('comments.message') }}
      </label>
      <textarea
        v-model="form.message"
        rows="4"
        :placeholder="t('comments.message_placeholder')"
        class="w-full rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:ring-2 resize-none"
        :class="v$.message.$error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'"
      />
      <p v-if="v$.message.required.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.message_required') }}
      </p>
      <p v-else-if="v$.message.alphaNumExtended.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.message_invalid') }}
      </p>
      <p v-else-if="v$.message.minLength.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.message_min') }}
      </p>
      <p v-else-if="v$.message.maxLength.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.message_max') }}
      </p>
    </div>

    <!-- Note -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-300">
        {{ t('comments.rating') }}
      </label>
      <div class="flex gap-2">
        <button
          v-for="n in 10"
          :key="n"
          type="button"
          class="h-9 w-9 rounded-lg text-sm font-medium transition"
          :class="form.rating === n
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          @click="form.rating = n"
        >
          {{ n }}
        </button>
      </div>
      <p v-if="v$.rating.$error && v$.rating.$dirty" class="mt-1 text-xs text-red-400">
        {{ t('comments.errors.rating_required') }}
      </p>
    </div>

    <!-- Bouton de soumission -->
    <button
      type="submit"
      class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
    >
      {{ t('comments.submit') }}
    </button>

  </form>
</template>