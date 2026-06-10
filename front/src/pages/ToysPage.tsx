import { useEffect, useState } from "react";
import { listToys } from "../api/toys";
import { HttpError } from "../api/client";
import type { Toy } from "../api/types";
import ToyCard from "../components/ToyCard";

export default function ToysPage() {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listToys()
      .then(setToys)
      .catch((err) =>
        setError(
          err instanceof HttpError ? err.message : "Impossible de charger les jouets",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-santa-red">
        Le catalogue de jouets 🧸
      </h1>

      {loading && <p className="text-slate-500">Chargement…</p>}
      {error && <p className="text-santa-red">{error}</p>}

      {!loading && !error && toys.length === 0 && (
        <p className="text-slate-500">Aucun jouet disponible pour l'instant.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {toys.map((toy) => (
          <ToyCard key={toy.id} toy={toy} />
        ))}
      </div>
    </div>
  );
}
