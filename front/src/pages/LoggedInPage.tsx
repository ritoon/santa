import { Link } from "react-router-dom";

export default function LoggedInPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-5xl">🎄✅</p>
        <h1 className="mt-4 text-2xl font-bold text-santa-green">
          Tu es bien connecté !
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Ton accès au Père Noël est ouvert. Bonne chasse aux cadeaux 🎁
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/toys" className="btn-primary">
            Voir les jouets
          </Link>
          <Link to="/wishlist" className="btn-secondary">
            Ma liste
          </Link>
        </div>
      </div>
    </div>
  );
}
