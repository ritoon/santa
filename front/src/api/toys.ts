import { apiFetch } from "./client";
import type { Toy } from "./types";

// Le catalogue est servi par l'API Go sur `GET /api/v1/products`. Chaque produit
// suit la structure `RawProduct` (champs en français) qu'on mappe vers `Toy`.

interface RawProduct {
  ID: number; // identifiant en base (clé JSON `ID`), utilisé dans l'URL de détail
  titre: string;
  prix: string; // ex : "120,00 €"
  description: string;
  images: string[];
  reference: string;
  categorie: string;
  sous_categorie: string;
  url: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f1f5f9"/><text x="50%" y="50%" font-size="48" text-anchor="middle" dominant-baseline="middle">🎁</text></svg>',
  );

/** Convertit "120,00 €" en 120. Renvoie undefined si non parsable. */
function parsePrice(raw: string): number | undefined {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : undefined;
}

/** Mappe un produit brut du JSON vers le modèle `Toy` consommé par le front. */
function toToy(raw: RawProduct): Toy {
  return {
    id: String(raw.ID),
    name: raw.titre,
    description: raw.description,
    imageUrl: raw.images[0] ?? PLACEHOLDER_IMAGE,
    category: raw.categorie,
    price: parsePrice(raw.prix),
  };
}

async function fetchProducts(): Promise<Toy[]> {
  // `auth: true` injecte le JWT du localStorage en `Authorization: Bearer <jwt>`.
  const raw = await apiFetch<RawProduct[]>("/api/v1/products", { auth: true });
  return raw.map(toToy);
}

export async function listToys(): Promise<Toy[]> {
  return fetchProducts();
}

export async function getToy(id: string): Promise<Toy> {
  // Détail d'un produit via son `id` : `GET /api/v1/products/:id`.
  const raw = await apiFetch<RawProduct>(`/api/v1/products/${id}`, {
    auth: true,
  });
  return toToy(raw);
}
