import { apiFetch } from "./client";
import type { Toy } from "./types";

// Le catalogue est servi par l'API Go sur `GET /products`. Chaque produit suit
// la structure `RawProduct` (champs en français) qu'on mappe vers `Toy`.

interface RawProduct {
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
    id: raw.reference,
    name: raw.titre,
    description: raw.description,
    imageUrl: raw.images[0] ?? PLACEHOLDER_IMAGE,
    category: raw.categorie,
    price: parsePrice(raw.prix),
  };
}

async function fetchProducts(): Promise<Toy[]> {
  const raw = await apiFetch<RawProduct[]>("/products");
  return raw.map(toToy);
}

export async function listToys(): Promise<Toy[]> {
  return fetchProducts();
}

export async function getToy(id: string): Promise<Toy> {
  const toys = await fetchProducts();
  const toy = toys.find((t) => t.id === id);
  if (!toy) {
    throw new Error("Jouet introuvable");
  }
  return toy;
}
