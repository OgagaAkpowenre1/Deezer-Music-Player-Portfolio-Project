export default function ScoreBoard({ streak, bestStreak, points }) {
  const multiplier =
    streak >= 10
      ? "3.0x"
      : streak >= 5
        ? "2.0x"
        : streak >= 3
          ? "1.5x"
          : "1.0x";

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto p-2 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl">
      <div className="flex flex-col items-center py-2 px-1">
        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
          Score
        </span>
        <span className="text-lg font-black text-neutral-100 font-mono mt-0.5">
          {points}
        </span>
      </div>

      <div className="flex flex-col items-center py-2 px-1 border-x border-neutral-800/80">
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Streak
          </span>
          {streak >= 3 && <span className="text-xs">🔥</span>}
        </div>
        <span className="text-lg font-black text-emerald-400 font-mono mt-0.5">
          {streak}
        </span>
      </div>

      <div className="flex flex-col items-center py-2 px-1">
        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
          Bonus
        </span>
        <span className="text-xs font-bold text-amber-400 font-mono mt-1.5">
          {multiplier}
        </span>
      </div>
    </div>
  );
}
