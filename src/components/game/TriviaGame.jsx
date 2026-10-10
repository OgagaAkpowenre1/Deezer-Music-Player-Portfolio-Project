import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Gamepad2, LogOut, Play } from "lucide-react";
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
      <div className="overflow-hidden rounded-lg bg-gradient-to-br from-[#2b2166] via-sp-card to-sp-card p-8 text-center sm:p-12">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Gamepad2 size={14} /> Minigame
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Song Guesser
          </h2>
          <p className="text-sm leading-relaxed text-sp-sub sm:text-base">
            Listen to a short 3.0-second preview clip and guess the right track.
            Pick a difficulty and test your music knowledge.
          </p>
        </div>

        {/* Difficulty Selection on Title Screen */}
        <div className="mt-8 space-y-3">
          <DifficultyPicker
            activeTier={tier}
            onSelect={(selectedTier) => setTier(selectedTier)}
            disabled={false}
          />
          <p className="text-sm text-sp-sub">
            <span className="font-bold text-white">
              {DIFFICULTY_CONFIG[tier]?.label}
            </span>{" "}
            · {DIFFICULTY_CONFIG[tier]?.description}
          </p>
        </div>

        {/* Start Game Action Button */}
        <div className="mt-8">
          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 rounded-full bg-sp-green px-8 py-3.5 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-sp-green-hover active:scale-95"
          >
            <Play size={18} fill="currentColor" /> Start game
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE GAMEPLAY SCREEN
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 rounded-lg bg-sp-card p-5 sm:p-8">
      <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-extrabold tracking-tight sm:justify-start">
            <Gamepad2 size={24} className="text-sp-green" /> Song Guesser
          </h2>
          <p className="mt-0.5 text-sm text-sp-sub">
            Identify the track from a 3.0-second preview
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <DifficultyPicker
            activeTier={tier}
            onSelect={handleTierChange}
            disabled={loadingPool}
          />
          <button
            onClick={handleQuitGame}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-white"
          >
            <LogOut size={14} /> Quit
          </button>
        </div>
      </div>

      <ScoreBoard streak={streak} bestStreak={bestStreak} points={points} />

      {loadingPool && (
        <div className="animate-pulse py-16 text-center text-sm text-sp-sub">
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
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
              >
                Next song <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
