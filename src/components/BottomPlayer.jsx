import { usePlayer } from "../context/PlayerContext";
import { Link } from "react-router-dom";

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const coverUrl =
    currentTrack.album?.cover_medium || currentTrack.artist?.picture_medium;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 px-4 py-3 md:px-8 text-neutral-200 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Left: Spinning Circle Art + Song Meta */}
        <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-0">
          <div className="relative w-12 h-12 shrink-0">
            <img
              src={coverUrl}
              alt={currentTrack.title}
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
              className="w-12 h-12 rounded-full object-cover border-2 border-neutral-700 shadow-md animate-spin-slow"
            />
            {/* Center vinyl spindle dot */}
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-neutral-950 rounded-full border border-neutral-700" />
          </div>

          <div className="min-w-0">
            <Link
              to={`/track/${currentTrack.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block text-sm font-semibold text-neutral-100 truncate"
            >
              {currentTrack.title}
            </Link>
            <Link
              to={`/track/${currentTrack.artist?.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block text-xs text-neutral-400 truncate"
            >
              {currentTrack.artist?.name}
            </Link>
          </div>
        </div>

        {/* Center: Play Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center font-bold text-sm shadow transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <div className="w-full flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-1.5 transition-all"
            />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume Slider & Mute */}
        <div className="hidden md:flex items-center justify-end gap-2.5 w-1/4">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer text-xs"
          >
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-24 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
