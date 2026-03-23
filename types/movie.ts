// types/movie.ts
// Représente un film tel que retourné par l'endpoint /movie/popular et /search/movie de l'API TMDB.
// On ne mappe que les champs affichés dans l'UI — pas la totalité de la réponse TMDB.

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

// Étend Movie avec les données supplémentaires de l'endpoint /movie/:id
// Le réalisateur et le casting sont extraits depuis /movie/:id/credits
export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string | null
  director: string | null
  cast: CastMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

// Structure de réponse paginée retournée par TMDB pour les listes de films
export interface PaginatedMovies {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}