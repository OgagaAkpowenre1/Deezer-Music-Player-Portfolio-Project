import { Link } from "react-router-dom";

export default function ArtistCard({ artist, rank }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/50 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-200 group cursor-pointer"
    >
      <div className="relative">
        <img
          src={artist.picture_medium}
          alt={artist.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-neutral-800 shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {rank && (
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center text-xs font-mono font-bold text-neutral-300">
            {rank}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs sm:text-sm font-semibold text-neutral-200 truncate w-full group-hover:text-emerald-400 group-hover:underline transition-colors">
        {artist.name}
      </p>
    </Link>
  );
}
