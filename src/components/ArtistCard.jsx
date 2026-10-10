import { Link } from "react-router-dom";

export default function ArtistCard({ artist, rank }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group block rounded-lg bg-sp-card p-4 transition-colors hover:bg-sp-highlight"
    >
      <img
        src={artist.picture_medium}
        alt={artist.name}
        loading="lazy"
        className="aspect-square w-full rounded-full bg-sp-highlight object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
      <p className="mt-4 truncate text-base font-bold">{artist.name}</p>
      <p className="mt-1 text-sm text-sp-sub">
        {rank ? `#${rank} · Artist` : "Artist"}
      </p>
    </Link>
  );
}
