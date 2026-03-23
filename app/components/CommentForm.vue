<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, alpha, between, helpers } from '@vuelidate/validators'
import { useCommentStore } from '../../stores/commentStore'
import type { CommentForm } from '../../types/comment'
import { reactive } from 'vue'

// Le composant reçoit l'id du film depuis la page détail
const props = defineProps<{
  movieId: number
}>()

const commentStore = useCommentStore()

// État du formulaire  correspond exactement à notre interface CommentForm
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
    'Le message ne doit contenir que des lettres, chiffres et espaces.',
    helpers.regex(/^[a-zA-ZÀ-ÿ0-9\s.,!?'"-]+$/)
  ),                 // lettres et chiffres
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
        Nom d'utilisateur
      </label>
      <input
        v-model="form.username"
        type="text"
        placeholder="Votre nom..."
        class="w-full rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:ring-2"
        :class="v$.username.$error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'"
      />
      <!-- Messages d'erreur -->
      <p v-if="v$.username.required.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        Le nom d'utilisateur est requis.
      </p>
      <p v-else-if="v$.message.alphaNumExtended.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        Le message ne doit contenir que des lettres, chiffres et espaces.
      </p>
      <p v-else-if="v$.username.minLength.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        Minimum 3 caractères.
      </p>
      <p v-else-if="v$.username.maxLength.$invalid && v$.username.$dirty" class="mt-1 text-xs text-red-400">
        Maximum 50 caractères.
      </p>
    </div>

    <!-- Message -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-300">
        Message
      </label>
      <textarea
        v-model="form.message"
        rows="4"
        placeholder="Votre commentaire..."
        class="w-full rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:ring-2 resize-none"
        :class="v$.message.$error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'"
      />
      <p v-if="v$.message.required.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        Le message est requis.
      </p>
        <p v-else-if="v$.message.alphaNumExtended.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        Le message ne doit contenir que des lettres, chiffres et espaces.
        </p>
      <p v-else-if="v$.message.minLength.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        Minimum 3 caractères.
      </p>
      <p v-else-if="v$.message.maxLength.$invalid && v$.message.$dirty" class="mt-1 text-xs text-red-400">
        Maximum 500 caractères.
      </p>
    </div>

    <!-- Note -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-300">
        Note (1 à 10)
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
        Veuillez sélectionner une note.
      </p>
    </div>

    <!-- Bouton de soumission -->
    <button
      type="submit"
      class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
    >
      Publier le commentaire
    </button>

  </form>
</template>