// tests/commentStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCommentStore } from '../stores/commentStore'

// On simule le localStorage car il n'existe pas dans l'environnement de test Node.js
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// On simule crypto.randomUUID car il n'existe pas dans Node.js
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => 'test-uuid-123' },
})

describe('commentStore', () => {
  // Avant chaque test on recrée un Pinia propre
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  it('démarre avec une liste de commentaires vide', () => {
    const store = useCommentStore()
    expect(store.comments).toHaveLength(0)
  })

  it('ajoute un commentaire correctement', () => {
    const store = useCommentStore()

    store.addComment(1, {
      username: 'Alice',
      message: 'Super film',
      rating: 8,
    })

    expect(store.comments).toHaveLength(1)
    expect(store.comments[0].username).toBe('Alice')
    expect(store.comments[0].movieId).toBe(1)
    expect(store.comments[0].rating).toBe(8)
  })

  it('persiste les commentaires dans le localStorage', () => {
    const store = useCommentStore()

    store.addComment(1, {
      username: 'Bob',
      message: 'Excellent',
      rating: 9,
    })

    const stored = JSON.parse(localStorageMock.getItem('cinema-app-comments') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].username).toBe('Bob')
  })

  it('filtre les commentaires par film', () => {
    const store = useCommentStore()

    store.addComment(1, { username: 'Alice', message: 'Film1', rating: 8 })
    store.addComment(2, { username: 'Bob', message: 'Film2', rating: 7 })
    store.addComment(1, { username: 'Charlie', message: 'Film1aussi', rating: 9 })

    const commentsFilm1 = store.getCommentsByMovie(1)
    const commentsFilm2 = store.getCommentsByMovie(2)

    expect(commentsFilm1).toHaveLength(2)
    expect(commentsFilm2).toHaveLength(1)
  })

  it('trie les commentaires du plus récent au plus ancien', () => {
    const store = useCommentStore()

    store.addComment(1, { username: 'Alice', message: 'Premier', rating: 8 })
    store.addComment(1, { username: 'Bob', message: 'Deuxieme', rating: 7 })

    const comments = store.getCommentsByMovie(1)

    // Le plus récent doit être en premier
    expect(comments[0].username).toBe('Bob')
    expect(comments[1].username).toBe('Alice')
  })

  it('supprime un commentaire par son id', () => {
    const store = useCommentStore()

    store.addComment(1, { username: 'Alice', message: 'Avis', rating: 8 })
    const id = store.comments[0].id

    store.deleteComment(id)

    expect(store.comments).toHaveLength(0)
  })
})