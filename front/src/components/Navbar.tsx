import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
  }`;

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <header className="bg-santa-red shadow-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-white">
          🎅 Liste au Père Noël
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/toys" className={linkClass}>
            Jouets
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/wishlist" className={linkClass}>
              Ma liste
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <span className="px-3 text-sm text-white/80">
                {user?.childName}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-md bg-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/30"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Connexion
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
