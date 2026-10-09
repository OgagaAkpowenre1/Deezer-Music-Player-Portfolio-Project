import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TrackCard from "../components/TrackCard";

export default function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artist/${id}`)
      .then((r) => r.json())
      .then((data) => setArtist(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-neutral-400">Loading artist...</div>;
  if (!artist || artist.error)
    return <div className="p-8 text-red-400">Artist not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-800">
        <img
          src={artist.picture_big}
          alt={artist.name}
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover shadow-xl border border-neutral-700"
        />
        <div className="text-center sm:text-left space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Artist
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            {artist.name}
          </h1>
          <p className="text-sm text-neutral-400">
            {Number(artist.nb_fan).toLocaleString()} Fans • {artist.nb_album}{" "}
            Releases
          </p>
        </div>
      </div>

      {/* Popular Tracks */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-neutral-200">Popular Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {artist.topTracks?.map((track, i) => (
            <TrackCard key={track.id} track={track} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Albums Discography */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-neutral-200">Discography</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {artist.albums?.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="group p-3 bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-800/60 transition-all flex flex-col items-center text-center"
            >
              <img
                src={album.cover_medium}
                alt={album.title}
                className="w-full aspect-square rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <p className="mt-2 text-sm font-semibold text-neutral-200 truncate w-full">
                {album.title}
              </p>
              <span className="text-xs text-neutral-500">
                {album.release_date?.slice(0, 4)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
