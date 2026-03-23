import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMovieStore } from '../../stores/movieStore'

// On simule les fonctions du service TMDB
// pour ne pas faire de vrais appels API pendant les tests
vi.mock('../services/tmdb', () => ({
  getPopularMovies: vi.fn().mockResolvedValue({
    results: [
      { id: 1, title: 'Inception', vote_average: 8.5, poster_path: null, overview: '', backdrop_path: null, release_date: '2010-07-16', vote_count: 100, genre_ids: [] },
      { id: 2, title: 'Dune', vote_average: 8.0, poster_path: null, overview: '', backdrop_path: null, release_date: '2021-10-22', vote_count: 200, genre_ids: [] },
    ],
    page: 1,
    total_pages: 5,
    total_results: 100,
  }),
  searchMovies: vi.fn().mockResolvedValue({
    results: [
      { id: 1, title: 'Inception', vote_average: 8.5, poster_path: null, overview: '', backdrop_path: null, release_date: '2010-07-16', vote_count: 100, genre_ids: [] },
    ],
    page: 1,
    total_pages: 1,
    total_results: 1,
  }),
}))

describe('movieStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('démarre avec une liste de films vide', () => {
    const store = useMovieStore()
    expect(store.movies).toHaveLength(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('charge les films populaires', async () => {
    const store = useMovieStore()
    await store.loadMovies()

    expect(store.movies).toHaveLength(2)
    expect(store.movies[0].title).toBe('Inception')
  })

  it('met à jour la recherche et recharge les films', async () => {
    const store = useMovieStore()
    await store.setSearchQuery('Inception')

    expect(store.searchQuery).toBe('Inception')
    expect(store.movies).toHaveLength(1)
    expect(store.movies[0].title).toBe('Inception')
  })

  it('hasMore est vrai si des pages restent', async () => {
    const store = useMovieStore()
    await store.loadMovies()

    // total_pages = 5, currentPage = 1 donc hasMore = true
    expect(store.hasMore).toBe(true)
  })

  it('isLoading passe à true pendant le chargement', async () => {
    const store = useMovieStore()
    const promise = store.loadMovies()

    expect(store.isLoading).toBe(true)
    await promise
    expect(store.isLoading).toBe(false)
  })
})