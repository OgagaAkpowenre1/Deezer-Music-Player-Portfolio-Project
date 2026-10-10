import { useEffect, useState, useCallback } from "react";
import DifficultyPicker, { DIFFICULTY_CONFIG } from "./DifficultyPicker";
import ScoreBoard from "./ScoreBoard";
import AudioSnippetPlayer from "./AudioSnippetPlayer";
import OptionGrid from "./OptionGrid";
import { useTriviaRound } from "../../hooks/useTriviaRound";

const OBSCURE_PLAYLISTS = [
  "1362508855", // Senegal
  "2098157262", // Slovenia
  "1423454352", // Tunisia
  "2154389022", // Bolivia
];

export default function TriviaGame() {
  // Game session control
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [tier, setTier] = useState("easy");
  const [trackPool, setTrackPool] = useState([]);
  const [loadingPool, setLoadingPool] = useState(false);

  // Score states
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { round, setRound, generateRound } = useTriviaRound();

  const handleTrackPlaybackError = () => {
    if (!round?.target) return;

    console.warn(`Skipping unplayable track: "${round.target.title}"`);

    // Remove the unplayable track from our memory pool
    const remaining = trackPool.filter((t) => t.id !== round.target.id);
    setTrackPool(remaining);

    // If we still have at least 4 tracks, spin up a new round immediately
    if (remaining.length >= 4) {
      generateRound(remaining);
    } else {
      // If pool exhausted, refetch pool for current tier
      loadPoolForTier(tier);
    }
  };

  const loadPoolForTier = useCallback(
    async (selectedTier) => {
      setLoadingPool(true);
      try {
        let tracks = [];

        if (selectedTier === "easy") {
          const res = await fetch("/api/chart?genre=0");
          const data = await res.json();
          tracks = data.tracks?.data?.slice(0, 10) || [];
        } else if (selectedTier === "medium") {
          const res = await fetch("/api/chart?genre=0");
          const data = await res.json();
          tracks = data.tracks?.data?.slice(10, 45) || [];
        } else if (selectedTier === "hard") {
          const res = await fetch("/api/chart?genre=85");
          const data = await res.json();
          tracks = data.tracks?.data || [];
        } else if (selectedTier === "impossible") {
          const randomPlaylistId =
            OBSCURE_PLAYLISTS[
              Math.floor(Math.random() * OBSCURE_PLAYLISTS.length)
            ];
          const res = await fetch(`/api/playlist/${randomPlaylistId}`);
          const data = await res.json();
          tracks = data.tracks?.data || [];
        }

        // Filter for valid preview URLs
        const validTracks = tracks.filter((t) => t && t.preview);

        if (validTracks.length >= 4) {
          setTrackPool(validTracks);
          generateRound(validTracks);
        } else {
          console.warn("Pool too small or failed, falling back to top chart.");
          const fallbackRes = await fetch("/api/chart?genre=0");
          const fallbackData = await fallbackRes.json();
          const fallbackTracks = (fallbackData.tracks?.data || []).filter(
            (t) => t.preview,
          );
          setTrackPool(fallbackTracks);
          generateRound(fallbackTracks);
        }
      } catch (err) {
        console.error("Failed to load trivia pool:", err);
      } finally {
        setLoadingPool(false);
      }
    },
    [generateRound],
  );

  // Trigger data fetch ONLY when the game has officially started
  useEffect(() => {
    if (isPlayingGame) {
      loadPoolForTier(tier);
    }
  }, [isPlayingGame, tier, loadPoolForTier]);

  const handleStartGame = () => {
    setIsPlayingGame(true);
  };

  const handleQuitGame = () => {
    setIsPlayingGame(false);
    setTrackPool([]);
    setRound(null);
  };

  const handleTierChange = (newTier) => {
    if (newTier === tier) {
      loadPoolForTier(newTier);
    } else {
      setTier(newTier);
    }
  };

  const handleSelectAnswer = (selectedId) => {
    if (!round || round.resolved) return;

    const isCorrect = selectedId === round.target.id;

    if (isCorrect) {
      const nextStreak = streak + 1;
      const multiplier =
        nextStreak >= 10 ? 3 : nextStreak >= 5 ? 2 : nextStreak >= 3 ? 1.5 : 1;
      const addedPoints = Math.round(100 * multiplier);

      setPoints((prev) => prev + addedPoints);
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
    } else {
      setStreak(0);
    }

    setRound((prev) => ({
      ...prev,
      resolved: true,
      selectedId,
      isCorrect,
    }));
  };

  const handleNextRound = () => {
    if (trackPool.length >= 4) {
      generateRound(trackPool);
    } else {
      loadPoolForTier(tier);
    }
  };

  // -------------------------------------------------------------
  // TITLE / LANDING SCREEN (Zero API calls made while on this view)
  // -------------------------------------------------------------
  if (!isPlayingGame) {
    return (
      <div className="w-full bg-gradient-to-b from-neutral-900/80 to-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8 sm:p-12 backdrop-blur-sm text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            <span>⚡</span> Interactive Minigame
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-100 tracking-tight">
            Song Guesser Challenge
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Listen to a short 3.0-second preview clip and guess the right track.
            Select your preferred challenge tier below and test your music
            knowledge.
          </p>
        </div>

        {/* Difficulty Selection on Title Screen */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-neutral-500 font-bold tracking-widest block">
            Select Difficulty
          </span>
          <DifficultyPicker
            activeTier={tier}
            onSelect={(selectedTier) => setTier(selectedTier)}
            disabled={false}
          />
          <p className="text-xs text-neutral-400 font-mono">
            Mode:{" "}
            <span className="text-emerald-400">
              {DIFFICULTY_CONFIG[tier]?.label}
            </span>{" "}
            — {DIFFICULTY_CONFIG[tier]?.description}
          </p>
        </div>

        {/* Start Game Action Button */}
        <div>
          <button
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Start Game ▶
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE GAMEPLAY SCREEN
  // -------------------------------------------------------------
  return (
    <div className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2">
            <span>⚡</span> Song Guesser
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Identify the track from a 3.0-second preview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DifficultyPicker
            activeTier={tier}
            onSelect={handleTierChange}
            disabled={loadingPool}
          />
          <button
            onClick={handleQuitGame}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-neutral-700/60 transition-colors cursor-pointer"
          >
            Quit
          </button>
        </div>
      </div>

      <ScoreBoard streak={streak} bestStreak={bestStreak} points={points} />

      {loadingPool && (
        <div className="py-16 text-center text-sm text-neutral-500 animate-pulse font-mono">
          Fetching songs for {DIFFICULTY_CONFIG[tier]?.label || tier}...
        </div>
      )}

      {!loadingPool && round && (
        <div className="space-y-6">
          <AudioSnippetPlayer
            previewUrl={round.target?.preview}
            duration={3.0}
            onError={handleTrackPlaybackError}
          />

          <OptionGrid
            options={round.options}
            onSelect={handleSelectAnswer}
            selectedId={round.selectedId}
            targetId={round.target?.id}
            resolved={round.resolved}
          />

          {round.resolved && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Next Song →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
