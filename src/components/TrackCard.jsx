import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function TrackCard({ track, rank, showArt = true }) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const isCurrentTrack = currentTrack?.id === track.id;
  const isActivePlaying = isCurrentTrack && isPlaying;
  const numbered = rank != null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => playTrack(track)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          playTrack(track);
        }
      }}
      className={`group grid items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none ${
        numbered
          ? "grid-cols-[1.5rem_minmax(0,1fr)_3rem]"
          : "grid-cols-[minmax(0,1fr)_3rem]"
      }`}
    >
      {/* Rank / equalizer / play icon */}
      {numbered && (
        <div className="flex items-center justify-center text-base tabular-nums text-sp-sub">
          {isActivePlaying ? (
            <>
              <span className="eq group-hover:hidden" aria-label="Playing">
                <i />
                <i />
                <i />
              </span>
              <Pause
                size={16}
                fill="currentColor"
                className="hidden text-white group-hover:block"
              />
            </>
          ) : (
            <>
              <span
                className={`group-hover:hidden ${
                  isCurrentTrack ? "text-sp-green" : ""
                }`}
              >
                {rank}
              </span>
              <Play
                size={16}
                fill="currentColor"
                className="hidden text-white group-hover:block"
              />
            </>
          )}
        </div>
      )}

      <div className="flex min-w-0 items-center gap-3">
        {showArt && (
          <div className="relative size-10 shrink-0 overflow-hidden rounded bg-sp-highlight">
            <img
              src={track.album?.cover_medium || track.artist?.picture_medium}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
            {!numbered && (
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/55 text-white transition-opacity ${
                  isCurrentTrack
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isActivePlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </div>
            )}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate">
            <Link
              to={`/track/${track.id}`}
              onClick={(e) => e.stopPropagation()} // Stop parent from triggering playTrack
              className={`text-base font-medium hover:underline ${
                isCurrentTrack ? "text-sp-green" : "text-white"
              }`}
            >
              {track.title}
            </Link>
          </p>
          {track.artist && (
            <p className="truncate">
              <Link
                to={`/artist/${track.artist.id}`}
                onClick={(e) => e.stopPropagation()} // Stop parent from triggering playTrack
                className="text-sm text-sp-sub hover:text-white hover:underline"
              >
                {track.artist.name}
              </Link>
            </p>
          )}
        </div>
      </div>

      <span className="justify-self-end text-sm tabular-nums text-sp-sub">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}
