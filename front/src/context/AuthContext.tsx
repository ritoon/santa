import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearToken, getToken, setToken } from "../api/client";
import type { AuthResponse, User } from "../api/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (auth: AuthResponse) => void;
  signInWithToken: (jwt: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "santa_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored && getToken()) {
      setUser(JSON.parse(stored) as User);
    }
  }, []);

  function signIn(auth: AuthResponse) {
    setToken(auth.token);
    setTokenState(auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    setUser(auth.user);
  }

  // Connexion via `POST /login` : on ne reçoit qu'un JWT, pas de profil.
  function signInWithToken(jwt: string) {
    setToken(jwt);
    setTokenState(jwt);
  }

  function signOut() {
    clearToken();
    setTokenState(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: token !== null,
        signIn,
        signInWithToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return ctx;
}
