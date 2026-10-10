import { usePlayer } from "../context/PlayerContext";
import { Link } from "react-router-dom";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import Slider from "./Slider";

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

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const PlayPauseIcon = isPlaying ? Pause : Play;

  return (
    <div className="shrink-0 bg-black px-2 pb-2 pt-2 md:px-3 md:pb-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-lg bg-sp-highlight p-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:bg-transparent md:p-0">
        {/* Left: artwork + song meta */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={coverUrl}
            alt={currentTrack.title}
            className="size-12 shrink-0 rounded-md bg-sp-highlight object-cover shadow-lg md:size-14"
          />
          <div className="min-w-0">
            <p className="truncate">
              <Link
                to={`/track/${currentTrack.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-white hover:underline"
              >
                {currentTrack.title}
              </Link>
            </p>
            <p className="truncate">
              <Link
                to={`/artist/${currentTrack.artist?.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-sp-sub hover:text-white hover:underline"
              >
                {currentTrack.artist?.name}
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile play button (sits beside the meta) */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-10 place-items-center rounded-full bg-white text-black md:hidden"
        >
          <PlayPauseIcon size={18} fill="currentColor" />
        </button>

        {/* Center: play button + progress */}
        <div className="col-span-2 flex w-full flex-col items-center gap-1 md:col-span-1 md:mx-auto md:max-w-[722px]">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="hidden size-8 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95 md:grid"
          >
            <PlayPauseIcon size={16} fill="currentColor" />
          </button>

          <div className="flex w-full items-center gap-2 text-xs tabular-nums text-sp-sub">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              label="Seek"
              min={0}
              max={duration || 30}
              step={0.1}
              value={currentTime}
              onChange={seek}
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: volume */}
        <div className="hidden items-center justify-end gap-2 md:flex">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-sp-sub transition-colors hover:text-white"
          >
            <VolumeIcon size={20} />
          </button>
          <div className="w-24">
            <Slider
              label="Volume"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
