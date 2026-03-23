// Gère les commentaires utilisateur stockés en localStorage.
// Les commentaires sont rattachés à un film via movieId et triés du plus récent au plus ancien.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Comment, CommentForm } from '../types/comment'

export const useCommentStore = defineStore('comments', () => {
  // Clé utilisée pour lire/écrire dans le localStorage
  // Définie une seule fois ici si elle change, on touche qu'à cet endroit
  const STORAGE_KEY = 'cinema-app-comments'

  // --- État ---

  // Tous les commentaires de tous les films chargés depuis le localStorage
  // On initialise directement depuis le localStorage au démarrage du store
  const comments = ref<Comment[]>(loadFromStorage())

  // --- Fonctions privées ---

  // Lit les commentaires depuis le localStorage
  // Retourne un tableau vide si rien n'est stocké ou si le JSON est invalide
  function loadFromStorage(): Comment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Si rien n'est stocké, on retourne un tableau vide
      if (!stored) return []
      return JSON.parse(stored) as Comment[]
    }
    catch {
      // Si le JSON est corrompu, on repart proprement
      return []
    }
  }

  // Sauvegarde tous les commentaires dans le localStorage
  function saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments.value))
  }

  // Retourne une fonction qui filtre les commentaires par film
  // et les trie du plus récent au plus ancien
  function getCommentsByMovie(movieId: number): Comment[] {
    return comments.value
      .filter(c => c.movieId === movieId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  // --- Actions ---

  // Ajoute un nouveau commentaire pour un film donné
  function addComment(movieId: number, form: CommentForm): void {
    const newComment: Comment = {
      // crypto.randomUUID() génère un identifiant unique garanti
      id: crypto.randomUUID(),
      movieId,
      username: form.username,
      message: form.message,
      // On s'assure que rating est bien un nombre le formulaire peut envoyer null
      rating: form.rating ?? 0,
      // Date.now() retourne le timestamp actuel en millisecondes
      // Plus grand = plus récent facile à trier
      createdAt: Date.now(),
    }

    // On ajoute le commentaire au début du tableau par cohérence sémentique
    comments.value.unshift(newComment)

    // On persiste immédiatement dans le localStorage
    saveToStorage()
  }

  // Crée un nouveau tableau qui contient tout sauf le commentaire à supprimer
  function deleteComment(id: string): void {
    comments.value = comments.value.filter(c => c.id !== id)
    saveToStorage()
  }

  return {
    comments,
    getCommentsByMovie,
    addComment,
    deleteComment,
  }
})