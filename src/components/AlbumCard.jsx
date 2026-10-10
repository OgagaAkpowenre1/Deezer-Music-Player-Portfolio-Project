import { Link } from "react-router-dom";

export default function AlbumCard({ album, subtitle }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group block rounded-lg bg-sp-card p-4 transition-colors hover:bg-sp-highlight"
    >
      <img
        src={album.cover_medium}
        alt={album.title}
        loading="lazy"
        className="aspect-square w-full rounded-md bg-sp-highlight object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
      <p className="mt-4 truncate text-base font-bold">{album.title}</p>
      {subtitle && (
        <p className="mt-1 truncate text-sm text-sp-sub">{subtitle}</p>
      )}
    </Link>
  );
}
