import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

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

  if (loading)
    return <div className="p-8 text-neutral-400">Loading track...</div>;
  if (!track || track.error)
    return <div className="p-8 text-red-400">Track not found.</div>;

  const isCurrent = currentTrack?.id === track.id;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={track.album?.cover_big}
          alt={track.title}
          className="w-52 h-52 rounded-2xl object-cover shadow-2xl border border-neutral-800"
        />
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {track.album?.record_type === "single" ? "Single" : "Track"}
          </span>
          <h1 className="text-3xl font-extrabold text-white">{track.title}</h1>
          <p className="text-lg text-neutral-300">
            <Link
              to={`/artist/${track.artist?.id}`}
              className="hover:underline text-emerald-400"
            >
              {track.artist?.name}
            </Link>
          </p>
          <p className="text-xs text-neutral-400">
            From album{" "}
            <Link
              to={`/album/${track.album?.id}`}
              className="hover:underline text-neutral-200"
            >
              {track.album?.title}
            </Link>
          </p>

          <button
            onClick={() => playTrack(track)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            {isCurrent && isPlaying ? "❚❚ Pause Preview" : "▶ Play 30s Preview"}
          </button>
        </div>
      </div>

      {/* Audio Metadata Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800">
        <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
          <span className="text-xs text-neutral-500 block">Release Date</span>
          <span className="text-sm font-semibold text-neutral-200">
            {track.release_date || "N/A"}
          </span>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
          <span className="text-xs text-neutral-500 block">Duration</span>
          <span className="text-sm font-semibold text-neutral-200">
            {Math.floor(track.duration / 60)}m {track.duration % 60}s
          </span>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
          <span className="text-xs text-neutral-500 block">BPM</span>
          <span className="text-sm font-semibold text-neutral-200">
            {track.bpm || "N/A"}
          </span>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
          <span className="text-xs text-neutral-500 block">Explicit</span>
          <span className="text-sm font-semibold text-neutral-200">
            {track.explicit_lyrics ? "Yes" : "Clean"}
          </span>
        </div>
      </div>
    </div>
  );
}
