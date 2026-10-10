import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import TrackCard from "../components/TrackCard";
import TrackListHeader from "../components/TrackListHeader";
import Page from "../components/Page";
import PageMessage from "../components/PageMessage";
import { usePlayer } from "../context/PlayerContext";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/album/${id}`)
      .then((r) => r.json())
      .then((data) => setAlbum(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageMessage loading>Loading album…</PageMessage>;
  if (!album || album.error)
    return <PageMessage>Album not found.</PageMessage>;

  const releaseYear = album.release_date ? album.release_date.slice(0, 4) : "";
  const tracks = album.tracks?.data || [];
  const firstTrack = tracks[0] && { ...tracks[0], album };
  const albumIsCurrent = tracks.some((t) => t.id === currentTrack?.id);
  const showPause = albumIsCurrent && isPlaying;

  return (
    <Page tint="from-[#6b3a52]/70">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <img
          src={album.cover_big}
          alt={album.title}
          className="size-48 rounded-md object-cover shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:size-56"
        />
        <div className="min-w-0 space-y-2 text-center sm:text-left">
          <span className="text-sm font-bold capitalize">
            {album.record_type || "Album"}
          </span>
          <h1 className="break-words text-4xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            {album.title}
          </h1>
          <p className="text-sm text-sp-sub">
            <Link
              to={`/artist/${album.artist?.id}`}
              className="font-bold text-white hover:underline"
            >
              {album.artist?.name}
            </Link>{" "}
            • {releaseYear} • {album.nb_tracks} songs
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8">
        <button
          onClick={() => firstTrack && playTrack(firstTrack)}
          disabled={!firstTrack?.preview}
          aria-label={showPause ? "Pause" : "Play album"}
          className="grid size-14 place-items-center rounded-full bg-sp-green text-black transition-transform hover:scale-105 hover:bg-sp-green-hover active:scale-95 disabled:opacity-40"
        >
          {showPause ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Tracklist */}
      <section className="mt-6">
        <TrackListHeader />
        <div>
          {tracks.map((track, i) => (
            <TrackCard
              key={track.id}
              track={{ ...track, album }}
              rank={i + 1}
              showArt={false}
            />
          ))}
        </div>
        {album.label && (
          <p className="mt-8 px-3 text-xs text-sp-sub">
            {releaseYear && `© ${releaseYear} `}
            {album.label}
          </p>
        )}
      </section>
    </Page>
  );
}
