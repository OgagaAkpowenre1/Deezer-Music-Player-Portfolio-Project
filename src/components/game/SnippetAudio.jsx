import { useEffect, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";

export default function SnippetAudio({ previewUrl, duration = 3.0 }) {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = previewUrl;

    const handleTimeUpdate = () => {
      // Offset starting point by 5s to bypass silent track intros
      const elapsed = audio.currentTime - 5.0;
      if (elapsed >= duration) {
        audio.pause();
        audio.currentTime = 5.0;
        setIsPlaying(false);
        setProgress(100);
      } else {
        setProgress(Math.max(0, (elapsed / duration) * 100));
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [previewUrl, duration]);

  const playSnippet = () => {
    const audio = audioRef.current;
    audio.currentTime = 5.0; // Start at 5 seconds
    setProgress(0);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(console.error);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={playSnippet}
        disabled={isPlaying}
        className="grid size-16 place-items-center rounded-full bg-sp-green text-black shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {isPlaying ? (
          <Volume2 size={26} />
        ) : (
          <Play size={26} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      {/* Progress bar showing 0 to 3 seconds */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-[#4d4d4d]">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-sp-sub">
        {isPlaying ? "Listening (3.0s)..." : "Click to play snippet"}
      </span>
    </div>
  );
}
