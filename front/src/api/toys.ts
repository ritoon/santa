import type { Toy } from "./types";

// ⚠️ Stand-in temporaire : l'API Go n'existe pas encore, donc on lit le
// catalogue depuis le fichier statique `front/public/products.json` (servi par
// Vite à la racine). Dès que l'API sera prête, remplace le corps de `listToys`
// et `getToy` par les appels commentés en bas de fichier.

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
  const res = await fetch(`${import.meta.env.BASE_URL}products.json`);
  if (!res.ok) {
    throw new Error("Impossible de charger le catalogue local");
  }
  const raw = (await res.json()) as RawProduct[];
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

// --- Version API (à réactiver quand le dossier `api/` sera disponible) -------
//
// import { apiFetch } from "./client";
//
// export function listToys(): Promise<Toy[]> {
//   return apiFetch<Toy[]>("/api/toys");
// }
//
// export function getToy(id: string): Promise<Toy> {
//   return apiFetch<Toy>(`/api/toys/${id}`);
// }
