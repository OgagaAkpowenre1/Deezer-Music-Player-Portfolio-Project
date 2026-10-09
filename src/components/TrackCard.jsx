import { Link } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

export default function TrackCard({ track, rank }) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const isCurrentTrack = currentTrack?.id === track.id;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all duration-200 ${
        isCurrentTrack
          ? "bg-neutral-800/90 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
          : "bg-neutral-900/60 hover:bg-neutral-800/70 border-neutral-800/70"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {rank && (
          <span className="w-5 text-center font-mono text-xs font-semibold text-neutral-500 group-hover:text-neutral-300">
            {rank}
          </span>
        )}

        {/* Album Artwork + Play overlay button */}
        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-neutral-800">
          <img
            src={track.album?.cover_medium || track.artist?.picture_medium}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
              isCurrentTrack
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-xs font-bold shadow">
              {isCurrentTrack && isPlaying ? "❚❚" : "▶"}
            </span>
          </div>
        </div>

        {/* Text links to Track and Artist pages */}
        <div className="min-w-0">
          {/* Link to Track Page */}
          <Link
            to={`/track/${track.id}`}
            onClick={(e) => e.stopPropagation()} // Stop parent from triggering playTrack
            className={`block font-medium text-sm truncate hover:underline ${
              isCurrentTrack ? "text-emerald-400" : "text-neutral-100"
            }`}
          >
            {track.title}
          </Link>

          {/* Link to Artist Page */}
          {track.artist && (
            <Link
              to={`/artist/${track.artist.id}`}
              onClick={(e) => e.stopPropagation()} // Stop parent from triggering playTrack
              className="block text-xs text-neutral-400 hover:text-neutral-200 hover:underline truncate"
            >
              {track.artist.name}
            </Link>
          )}
        </div>
      </div>

      <div className="shrink-0 pl-3">
        <span className="text-xs text-neutral-500 font-mono">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
}
