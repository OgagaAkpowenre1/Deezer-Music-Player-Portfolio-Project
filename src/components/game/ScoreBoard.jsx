import { Flame } from "lucide-react";

export default function ScoreBoard({ streak, points }) {
  const multiplier =
    streak >= 10
      ? "3.0x"
      : streak >= 5
        ? "2.0x"
        : streak >= 3
          ? "1.5x"
          : "1.0x";

  const labelCls =
    "text-[11px] font-bold uppercase tracking-wider text-sp-sub";

  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-3 divide-x divide-white/10 rounded-lg bg-white/5 py-3">
      <div className="flex flex-col items-center gap-1 px-2">
        <span className={labelCls}>Score</span>
        <span className="text-2xl font-extrabold tabular-nums">{points}</span>
      </div>

      <div className="flex flex-col items-center gap-1 px-2">
        <span className={`${labelCls} flex items-center gap-1`}>
          Streak
          {streak >= 3 && (
            <Flame size={13} className="text-orange-400" fill="currentColor" />
          )}
        </span>
        <span className="text-2xl font-extrabold tabular-nums text-sp-green">
          {streak}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1 px-2">
        <span className={labelCls}>Bonus</span>
        <span className="text-2xl font-extrabold tabular-nums">
          {multiplier}
        </span>
      </div>
    </div>
  );
}
