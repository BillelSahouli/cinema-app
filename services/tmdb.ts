// Centralise tous les appels à l'API TMDB.
// Aucune page ou composant n'appelle TMDB directement tout passe par ici.

import { useRuntimeConfig } from 'nuxt/app'
import type { CastMember, MovieDetail, PaginatedMovies } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'

// Fonction utilitaire privée — factorise les headers communs à chaque requête.
// Non exportée car personne en dehors de ce fichier n'a besoin de l'appeler.
async function tmdbFetch<T>(endpoint: string, query: Record<string, unknown> = {}): Promise<T> {
  // useRuntimeConfig() donne accès aux variables définies dans nuxt.config.ts
  const config = useRuntimeConfig()

  return $fetch<T>(`${BASE_URL}${endpoint}`, {
    headers: {
      // TMDB utilise un Bearer Token pour authentifier chaque requête
      Authorization: `Bearer ${config.public.tmdbApiKey}`,
    },
    query,
  })
}

// Récupère les films populaires utilisé pour la liste avec infinite scroll
export async function getPopularMovies(page: number = 1): Promise<PaginatedMovies> {
  return tmdbFetch<PaginatedMovies>('/movie/popular', { page })
}

// Recherche des films par nom utilisé pour la barre de recherche
export async function searchMovies(query: string, page: number = 1): Promise<PaginatedMovies> {
  return tmdbFetch<PaginatedMovies>('/search/movie', { query, page })
}

// Récupère le détail d'un film + son réalisateur et son casting
// On fait deux appels en parallèle avec Promise.all pour gagner du temps
export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const [movie, credits] = await Promise.all([
    tmdbFetch<any>(`/movie/${id}`),
    tmdbFetch<any>(`/movie/${id}/credits`),
  ])

  // On extrait le réalisateur depuis la liste de l'équipe technique
  const director = credits.crew.find((p: any) => p.job === 'Director')?.name ?? null

  // On garde les 10 premiers acteurs uniquement
  const cast: CastMember[] = credits.cast.slice(0, 10).map((a: any) => ({
    id: a.id,
    name: a.name,
    character: a.character,
    profile_path: a.profile_path ?? null,
  }))

  return {
    ...movie,
    director,
    cast,
  }
}