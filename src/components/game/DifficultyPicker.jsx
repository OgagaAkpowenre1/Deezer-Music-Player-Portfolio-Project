export const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    description: "Top 10 Global Viral Hits",
    color: "emerald",
  },
  medium: {
    label: "Medium",
    description: "Worldwide Chart (Positions 20–50)",
    color: "blue",
  },
  hard: {
    label: "Hard",
    description: "Alternative & Indie Genre Charts",
    color: "amber",
  },
  impossible: {
    label: "Impossible",
    description: "Regional & Non-Western Top Charts",
    color: "rose",
  },
};

export default function DifficultyPicker({ activeTier, onSelect, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
        const isActive = activeTier === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border disabled:opacity-50 cursor-pointer ${
              isActive
                ? "bg-neutral-100 text-neutral-950 border-white shadow-lg"
                : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
