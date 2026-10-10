import { useState, useCallback } from "react";

// Fisher-Yates Shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useTriviaRound() {
  const [round, setRound] = useState(null);

  const generateRound = useCallback((trackPool) => {
    // Only use tracks that have valid preview audio URLs
    const playableTracks = trackPool.filter((t) => t.preview);
    if (playableTracks.length < 4) return null;

    // Pick 1 target track
    const targetIndex = Math.floor(Math.random() * playableTracks.length);
    const target = playableTracks[targetIndex];

    // Pick 3 random distractors from remaining tracks
    const others = playableTracks.filter((t) => t.id !== target.id);
    const shuffledOthers = shuffle(others).slice(0, 3);

    // Combine and shuffle the 4 choices
    const options = shuffle([target, ...shuffledOthers]);

    const newRound = {
      target,
      options,
      resolved: false,
      selectedId: null,
      isCorrect: null,
    };

    setRound(newRound);
    return newRound;
  }, []);

  return { round, setRound, generateRound };
}
