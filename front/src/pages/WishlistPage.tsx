import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
  sendWishlistToParent,
} from "../api/wishlist";
import { HttpError } from "../api/client";
import type { Wishlist } from "../api/types";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire d'envoi au parent
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  useEffect(() => {
    getWishlist()
      .then(setWishlist)
      .catch((err) =>
        setError(
          err instanceof HttpError ? err.message : "Impossible de charger la liste",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(itemId: string) {
    await removeFromWishlist(itemId);
    setWishlist((prev) =>
      prev
        ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
        : prev,
    );
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendFeedback(null);
    try {
      const updated = await sendWishlistToParent({
        parentName,
        parentEmail,
        message: message || undefined,
      });
      setWishlist(updated);
      setSendFeedback(
        `Ta liste a été envoyée à ${parentName} ! Le Père Noël arrive bientôt 🎅`,
      );
    } catch (err) {
      setSendFeedback(
        err instanceof HttpError ? err.message : "Envoi impossible",
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error) return <p className="text-santa-red">{error}</p>;
  if (!wishlist) return null;

  const isEmpty = wishlist.items.length === 0;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h1 className="mb-6 text-2xl font-bold text-santa-red">
          Ma liste au Père Noël 🎁
        </h1>

        {wishlist.sentToParent && (
          <p className="mb-4 rounded-lg bg-santa-green/10 px-4 py-2 text-sm font-medium text-santa-green">
            ✅ Cette liste a déjà été envoyée à tes parents.
          </p>
        )}

        {isEmpty ? (
          <p className="text-slate-500">
            Ta liste est vide.{" "}
            <Link to="/toys" className="font-medium text-santa-red">
              Parcours le catalogue
            </Link>{" "}
            pour ajouter des jouets !
          </p>
        ) : (
          <ul className="space-y-3">
            {wishlist.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
              >
                <img
                  src={item.toy.imageUrl}
                  alt={item.toy.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <Link
                    to={`/toys/${item.toy.id}`}
                    className="font-semibold text-slate-900 hover:text-santa-red"
                  >
                    {item.toy.name}
                  </Link>
                  <p className="text-xs text-slate-500">{item.toy.category}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-sm font-medium text-slate-400 hover:text-santa-red"
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside>
        <h2 className="mb-4 text-lg font-bold text-santa-green">
          Envoyer à mes parents ✉️
        </h2>
        <form
          onSubmit={handleSend}
          className="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Prénom du parent
            </span>
            <input
              type="text"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Email du parent
            </span>
            <input
              type="email"
              required
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Petit mot (optionnel)
            </span>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input resize-none"
            />
          </label>

          {sendFeedback && (
            <p className="text-sm font-medium text-santa-green">
              {sendFeedback}
            </p>
          )}

          <button
            type="submit"
            disabled={sending || isEmpty}
            className="btn-secondary w-full"
          >
            {sending ? "Envoi…" : "Envoyer ma liste"}
          </button>
          {isEmpty && (
            <p className="text-center text-xs text-slate-400">
              Ajoute au moins un jouet avant d'envoyer.
            </p>
          )}
        </form>
      </aside>
    </div>
  );
}
