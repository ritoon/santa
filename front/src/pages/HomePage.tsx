import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <p className="text-6xl">🎅🎄🎁</p>
      <h1 className="mt-6 text-4xl font-extrabold text-santa-red">
        Prépare ta liste pour le Père Noël
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Parcours le catalogue de jouets, ajoute tes préférés à ta liste, et
        envoie-la à tes parents pour qu'ils la transmettent au Père Noël !
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/toys" className="btn-primary">
          Voir les jouets 🧸
        </Link>
        {!isAuthenticated && (
          <Link to="/register" className="btn-secondary">
            Créer mon compte
          </Link>
        )}
      </div>
    </div>
  );
}
