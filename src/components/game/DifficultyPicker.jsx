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
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
              isActive
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
