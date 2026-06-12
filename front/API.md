# Contrat d'API attendu par le front

Le front (`front/`) consomme une API REST JSON servie par défaut sur
`http://localhost:8080` (configurable via `VITE_API_URL`). Ce document décrit
le contrat **que le dossier `api/` doit implémenter**. Tant que l'API n'existe
pas, le front compile et s'affiche, mais les appels réseau échoueront.

## Conventions

- Toutes les réponses sont en JSON.
- Les erreurs renvoient un statut HTTP ≥ 400 avec un corps `{ "error": "message" }`.
- L'authentification se fait via un **JWT** transmis dans l'en-tête
  `Authorization: Bearer <token>`.
- CORS doit autoriser l'origine du front (`http://localhost:5173` en dev).

## Modèles

```jsonc
// User
{ "id": "string", "email": "string", "childName": "string", "age": 8 }

// Product — structure brute renvoyée par `GET /api/v1/products`
{
  "titre": "string",
  "prix": "120,00 €",        // chaîne, virgule décimale + symbole €
  "description": "string",
  "images": ["string"],      // URLs, la première est utilisée comme vignette
  "reference": "string",     // identifiant produit
  "categorie": "string",
  "sous_categorie": "string",
  "url": "string"
}

// Toy — modèle consommé par le front, dérivé de Product côté client
// (reference→id, titre→name, prix parsé en nombre, images[0]→imageUrl)
{
  "id": "string",
  "name": "string",
  "description": "string",
  "imageUrl": "string",
  "category": "string",
  "price": 29.99            // optionnel
}

// WishlistItem
{ "id": "string", "toy": { /* Toy */ }, "addedAt": "RFC3339" }

// Wishlist
{ "id": "string", "items": [ /* WishlistItem */ ], "sentToParent": false }

// AuthResponse
{ "token": "jwt", "user": { /* User */ } }
```

## Endpoints

### Authentification (public)

| Méthode | Chemin           | Corps                                                  | Réponse        |
| ------- | ---------------- | ------------------------------------------------------ | -------------- |
| POST    | `/api/register`  | `{ email, password, childName, age? }`                 | `AuthResponse` |
| POST    | `/api/login`     | `{ email, password }`                                  | `AuthResponse` |

### Catalogue de jouets (public)

| Méthode | Chemin              | Réponse     |
| ------- | ------------------- | ----------- |
| GET     | `/api/v1/products`  | `Product[]` |

> Le front récupère le catalogue via `GET /api/v1/products` et mappe chaque
> `Product` vers un `Toy` (voir `src/api/toys.ts`). Le détail d'un jouet
> (`getToy`) est résolu côté client à partir de cette liste — il n'y a pas
> d'endpoint `/api/v1/products/:id`.

### Liste de souhaits (authentifié — `Authorization: Bearer`)

| Méthode | Chemin                       | Corps                              | Réponse     |
| ------- | ---------------------------- | ---------------------------------- | ----------- |
| GET     | `/api/wishlist`              | —                                  | `Wishlist`  |
| POST    | `/api/wishlist/items`        | `{ toyId }`                        | `Wishlist`  |
| DELETE  | `/api/wishlist/items/:id`    | —                                  | `204`       |
| POST    | `/api/wishlist/send`         | `{ parentName, parentEmail, message? }` | `Wishlist` (avec `sentToParent: true`) |

> La wishlist est implicitement celle de l'utilisateur authentifié (déduite du
> JWT) — le front n'envoie jamais d'identifiant d'utilisateur.
