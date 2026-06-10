import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getToy } from "../api/toys";
import { addToWishlist } from "../api/wishlist";
import { HttpError } from "../api/client";
import type { Toy } from "../api/types";
import { useAuth } from "../context/AuthContext";

export default function ToyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [toy, setToy] = useState<Toy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    getToy(id)
      .then(setToy)
      .catch((err) =>
        setError(err instanceof HttpError ? err.message : "Jouet introuvable"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAdd() {
    if (!id) return;
    setAdding(true);
    setFeedback(null);
    try {
      await addToWishlist(id);
      setFeedback("Ajouté à ta liste ! 🎁");
    } catch (err) {
      setFeedback(
        err instanceof HttpError ? err.message : "Ajout impossible",
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error) return <p className="text-santa-red">{error}</p>;
  if (!toy) return null;

  return (
    <div>
      <Link to="/toys" className="text-sm font-medium text-santa-red">
        ← Retour au catalogue
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <img
            src={toy.imageUrl}
            alt={toy.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-santa-green">
            {toy.category}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{toy.name}</h1>
          {toy.price !== undefined && (
            <p className="mt-2 text-xl font-bold text-santa-red">
              {toy.price.toFixed(2)} €
            </p>
          )}
          <p className="mt-4 text-slate-600">{toy.description}</p>

          {isAuthenticated ? (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="btn-primary mt-6"
            >
              {adding ? "Ajout…" : "Ajouter à ma liste 🎁"}
            </button>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              <Link to="/login" className="font-medium text-santa-red">
                Connecte-toi
              </Link>{" "}
              pour ajouter ce jouet à ta liste.
            </p>
          )}

          {feedback && (
            <p className="mt-3 text-sm font-medium text-santa-green">
              {feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
