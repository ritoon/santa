import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { HttpError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await register({
        email,
        password,
        childName,
        age: age ? Number(age) : undefined,
      });
      signIn(auth);
      navigate("/toys");
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Inscription impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-santa-red">
        Crée ton compte 🎄
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <Field label="Prénom de l'enfant">
          <input
            type="text"
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Âge">
          <input
            type="number"
            min={1}
            max={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Email du parent">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Mot de passe">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>

        {error && <p className="text-sm text-santa-red">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Création…" : "S'inscrire"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link to="/login" className="font-medium text-santa-red">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
