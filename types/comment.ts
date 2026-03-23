// Représente un commentaire utilisateur stocké en localStorage.
// Les commentaires sont rattachés à un film via movieId et triés par createdAt décroissant.

export interface Comment {
  id: string        // généré via crypto.randomUUID() à la soumission
  movieId: number   // id du film TMDB concerné
  username: string
  message: string
  rating: number    // note de 1 à 10 donnée par l'utilisateur
  createdAt: number // timestamp Unix — facilite le tri du plus récent au plus ancien
}

// Représente l'état du formulaire avant soumission.
// id, movieId et createdAt sont générés automatiquement, ils n'appartiennent pas au formulaire.
export interface CommentForm {
  username: string
  message: string
  rating: number | null // null tant que l'utilisateur n'a pas sélectionné de note
}