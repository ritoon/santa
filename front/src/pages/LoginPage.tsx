import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { HttpError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signInWithToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // `apiFetch` lève une `HttpError` si le status n'est pas 2xx.
      const { jwt } = await login({ email, password });
      signInWithToken(jwt); // stocke le JWT dans le localStorage
      navigate("/logged-in", { replace: true });
    } catch (err) {
      setError(
        err instanceof HttpError ? err.message : "Identifiants invalides",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-santa-red">Connexion 🔑</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Mot de passe
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </label>

        {error && <p className="text-sm text-santa-red">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-medium text-santa-red">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
