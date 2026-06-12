import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LoggedInPage from "./pages/LoggedInPage";
import ToysPage from "./pages/ToysPage";
import ToyDetailPage from "./pages/ToyDetailPage";
import WishlistPage from "./pages/WishlistPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="logged-in" element={<LoggedInPage />} />
        <Route path="toys" element={<ToysPage />} />
        <Route path="toys/:id" element={<ToyDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
