import { useEffect, useRef, useState } from "react";
import { Pause, Play, TriangleAlert } from "lucide-react";

export default function AudioSnippetPlayer({
  previewUrl,
  duration = 3.0,
  onSnippetEnd,
  onError,
}) {
  const audioRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Initialize and tear down single Audio instance
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      stopSnippet();
      if (onSnippetEnd) onSnippetEnd();
    };

    const handleAudioError = (e) => {
      // Ignore abort errors caused by switching tracks
      if (audio.error && audio.error.code === MediaError.MEDIA_ERR_ABORTED) {
        return;
      }
      console.warn("Audio stream failed for current preview:", previewUrl, e);
      setHasError(true);
      stopSnippet();
      if (onError) onError();
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleAudioError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleAudioError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  // Update source safely when round target changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    stopSnippet();
    setHasError(false);

    if (previewUrl && previewUrl.trim()) {
      audio.src = previewUrl;
      audio.preload = "auto";
      audio.load();
    } else {
      audio.removeAttribute("src");
      audio.load();
    }
  }, [previewUrl]);

  const stopSnippet = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      try {
        audioRef.current.currentTime = 0;
      } catch (_) {}
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const playSnippet = async () => {
    if (!previewUrl || !audioRef.current || hasError) return;
    const audio = audioRef.current;

    if (isPlaying) {
      stopSnippet();
      return;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
      startTimeRef.current = performance.now();

      const tick = (now) => {
        const elapsed = (now - startTimeRef.current) / 1000;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setProgress(pct);

        if (elapsed >= duration) {
          stopSnippet();
          if (onSnippetEnd) onSnippetEnd();
        } else {
          animFrameRef.current = requestAnimationFrame(tick);
        }
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      // AbortError happens normally if clicked rapidly or paused mid-flight
      if (err.name !== "AbortError") {
        console.warn("Playback could not start:", err);
        setHasError(true);
        if (onError) onError();
      }
      stopSnippet();
    }
  };

  const Icon = hasError ? TriangleAlert : isPlaying ? Pause : Play;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <button
        onClick={playSnippet}
        disabled={!previewUrl || hasError}
        aria-label={isPlaying ? "Stop snippet" : "Play 3-second snippet"}
        className="grid size-20 place-items-center rounded-full bg-sp-green text-black shadow-[0_8px_24px_rgba(30,215,96,0.25)] transition-transform hover:scale-105 hover:bg-sp-green-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        <Icon
          size={32}
          fill={hasError ? "none" : "currentColor"}
          className={!isPlaying && !hasError ? "ml-1" : ""}
        />
      </button>

      <div className="flex w-56 flex-col items-center gap-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#4d4d4d]">
          <div
            className="h-full bg-white transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-sp-sub">
          {hasError
            ? "Track unavailable, skipping..."
            : isPlaying
              ? "Playing 3.0s slice..."
              : "Click to play the snippet"}
        </span>
      </div>
    </div>
  );
}
