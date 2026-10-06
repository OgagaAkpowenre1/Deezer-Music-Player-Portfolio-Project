import { useState } from "react";

export default function TrackCard({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio());

  const togglePlay = () => {
    if (!track.preview) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = track.preview;
      audio.play().catch((err) => console.error("Playback error:", err));
      setIsPlaying(true);
    }

    audio.onended = () => setIsPlaying(false);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="group relative flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 transition-all duration-200">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-800">
          <img
            src={track.album?.cover_medium || track.artist?.picture_medium}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <button
            onClick={togglePlay}
            disabled={!track.preview}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
          >
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-md">
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </button>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-neutral-100 text-sm truncate">
            {track.title}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            {track.artist?.name}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 pl-3">
        <span className="text-xs text-neutral-500 font-mono">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
}
