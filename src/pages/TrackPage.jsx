import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import Page from "../components/Page";
import PageMessage from "../components/PageMessage";

export default function TrackPage() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/track/${id}`)
      .then((r) => r.json())
      .then((data) => setTrack(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageMessage loading>Loading track…</PageMessage>;
  if (!track || track.error)
    return <PageMessage>Track not found.</PageMessage>;

  const isCurrent = currentTrack?.id === track.id;
  const showPause = isCurrent && isPlaying;

  const details = [
    { label: "Release date", value: track.release_date || "N/A" },
    {
      label: "Duration",
      value: `${Math.floor(track.duration / 60)}m ${track.duration % 60}s`,
    },
    { label: "BPM", value: track.bpm || "N/A" },
    { label: "Explicit", value: track.explicit_lyrics ? "Yes" : "Clean" },
  ];

  return (
    <Page tint="from-[#2f4f7a]/70">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <img
          src={track.album?.cover_big}
          alt={track.title}
          className="size-48 rounded-md object-cover shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:size-56"
        />
        <div className="min-w-0 space-y-2 text-center sm:text-left">
          <span className="text-sm font-bold">
            {track.album?.record_type === "single" ? "Single" : "Song"}
          </span>
          <h1 className="break-words text-4xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            {track.title}
          </h1>
          <p className="text-sm text-sp-sub">
            <Link
              to={`/artist/${track.artist?.id}`}
              className="font-bold text-white hover:underline"
            >
              {track.artist?.name}
            </Link>{" "}
            •{" "}
            <Link
              to={`/album/${track.album?.id}`}
              className="hover:text-white hover:underline"
            >
              {track.album?.title}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => playTrack(track)}
          aria-label={showPause ? "Pause preview" : "Play 30s preview"}
          className="grid size-14 place-items-center rounded-full bg-sp-green text-black transition-transform hover:scale-105 hover:bg-sp-green-hover active:scale-95"
        >
          {showPause ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        <span className="text-sm text-sp-sub">
          {showPause ? "Playing 30s preview" : "Play 30s preview"}
        </span>
      </div>

      {/* Audio Metadata */}
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wider text-sp-sub">
              {label}
            </dt>
            <dd className="mt-1 text-lg font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}
