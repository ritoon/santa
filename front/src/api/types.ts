// Types partagés avec le contrat REST de l'API Go (voir front/API.md).

export interface User {
  id: string;
  email: string;
  childName: string;
  age?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Réponse de `POST /login` : l'API ne renvoie que le JWT de session.
export interface LoginResponse {
  jwt: string;
}

export interface Toy {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number;
}

export interface WishlistItem {
  id: string;
  toy: Toy;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  sentToParent: boolean;
}

export interface ApiError {
  error: string;
}
