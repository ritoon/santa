import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <img
        src="/header.jpeg"
        alt="Père Noël Gopher devant un sapin enneigé"
        className="h-48 w-full object-cover md:h-64"
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
