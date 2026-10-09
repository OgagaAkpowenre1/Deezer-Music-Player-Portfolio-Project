import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TrackCard from "../components/TrackCard";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/album/${id}`)
      .then((r) => r.json())
      .then((data) => setAlbum(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-neutral-400">Loading album...</div>;
  if (!album || album.error)
    return <div className="p-8 text-red-400">Album not found.</div>;

  const releaseYear = album.release_date ? album.release_date.slice(0, 4) : "";

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-neutral-800">
        <img
          src={album.cover_big}
          alt={album.title}
          className="w-44 h-44 rounded-xl object-cover shadow-2xl border border-neutral-800"
        />
        <div className="text-center sm:text-left space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            {album.record_type || "Album"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {album.title}
          </h1>
          <p className="text-sm text-neutral-300">
            By{" "}
            <Link
              to={`/artist/${album.artist?.id}`}
              className="hover:underline text-emerald-400 font-medium"
            >
              {album.artist?.name}
            </Link>{" "}
            • {releaseYear} • {album.nb_tracks} songs
          </p>
          {album.label && (
            <p className="text-xs text-neutral-500">
              Record Label: {album.label}
            </p>
          )}
        </div>
      </div>

      {/* Tracklist */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-200">Tracklist</h2>
        <div className="space-y-2">
          {album.tracks?.data?.map((track, i) => (
            <TrackCard
              key={track.id}
              track={{ ...track, album }}
              rank={i + 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
