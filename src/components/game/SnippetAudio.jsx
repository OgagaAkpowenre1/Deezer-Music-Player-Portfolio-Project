import { useEffect, useRef, useState } from "react";

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
        className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-neutral-950 font-bold flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
      >
        {isPlaying ? "🔊" : "▶"}
      </button>

      {/* Progress bar showing 0 to 3 seconds */}
      <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-neutral-400 font-mono">
        {isPlaying ? "Listening (3.0s)..." : "Click to Play Snippet"}
      </span>
    </div>
  );
}
