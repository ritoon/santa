import { Link } from "react-router-dom";
import type { Toy } from "../api/types";

export default function ToyCard({ toy }: { toy: Toy }) {
  return (
    <Link
      to={`/toys/${toy.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={toy.imageUrl}
          alt={toy.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-santa-green">
          {toy.category}
        </span>
        <h3 className="mt-1 font-semibold text-slate-900">{toy.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {toy.description}
        </p>
        {toy.price !== undefined && (
          <span className="mt-3 text-sm font-bold text-santa-red">
            {toy.price.toFixed(2)} €
          </span>
        )}
      </div>
    </Link>
  );
}
