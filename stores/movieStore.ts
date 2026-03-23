// Gère l'état global des films : liste, pagination, recherche et infinite scroll.
// Toutes les pages qui ont besoin des films passent par ce store.

import { defineStore } from 'pinia'
import { getPopularMovies, searchMovies } from '../services/tmdb'
import type { Movie } from '../types/movie'
import { computed, ref } from 'vue'

export const useMovieStore = defineStore('movies', () => {

  // La liste des films affichés s'accumule au fil du scroll
  const movies = ref<Movie[]>([])

  // La page actuelle commence à 1, s'incrémente à chaque chargement
  const currentPage = ref(1)

  // Le nombre total de pages disponibles sur TMDB
  const totalPages = ref(1)

  // Le terme de recherche saisi par l'utilisateur
  const searchQuery = ref('')

  // Indique si un appel API est en cours pour afficher les skeletons
  const isLoading = ref(false)

  // Indique si une erreur s'est produite
  const error = ref<string | null>(null)

  // --- Computed ---

  // Vrai s'il reste des pages à charger utilisé pour stopper l'infinite scroll
  const hasMore = computed(() => currentPage.value < totalPages.value)

  // --- Actions ---

  // Charge la première page appelé au montage de la page liste
  // ou quand la recherche change
  async function loadMovies(force: boolean = false) {
    // Si des films sont déjà chargés et qu'on ne force pas, on ne recharge pas
    if (movies.value.length > 0 && !force) return
    // On repart de zéro : on vide la liste et on reset la pagination
    movies.value = []
    currentPage.value = 1
    error.value = null
    isLoading.value = true

    try {
      const data = searchQuery.value
        // Si l'utilisateur a tapé quelque chose, on cherche
        ? await searchMovies(searchQuery.value, 1)
        // Sinon on charge les films populaires
        : await getPopularMovies(1)

      movies.value = data.results
      totalPages.value = data.total_pages
    }
    catch (e) {
      error.value = 'Une erreur est survenue lors du chargement des films.'
    }
    finally {
      // "finally" s'exécute toujours succès ou erreur
      // On arrête le loading dans tous les cas
      isLoading.value = false
    }
  }

  // Charge la page suivante appelé quand l'utilisateur arrive en bas de page
  async function loadMore() {
    // Si déjà en train de charger ou plus rien à charger, on ne fait rien
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    currentPage.value++

    try {
      const data = searchQuery.value
        ? await searchMovies(searchQuery.value, currentPage.value)
        : await getPopularMovies(currentPage.value)

      // On ajoute les nouveaux films à la suite pas de remplacement
      movies.value.push(...data.results)
    }
    catch (e) {
      // On remet la page en arrière si le chargement a échoué
      currentPage.value--
      error.value = 'Une erreur est survenue lors du chargement.'
    }
    finally {
      isLoading.value = false
    }
  }

  // Met à jour la recherche et recharge depuis le début
  function setSearchQuery(query: string) {
    searchQuery.value = query
    loadMovies()
  }

  return {
    movies,
    searchQuery,
    isLoading,
    error,
    hasMore,
    loadMovies,
    loadMore,
    setSearchQuery,
  }
})