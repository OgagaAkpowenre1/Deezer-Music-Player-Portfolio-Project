export const GENRES = [
  { id: "0", label: "Worldwide" },
  { id: "132", label: "Pop" },
  { id: "116", label: "Hip-Hop" },
  { id: "152", label: "Rock" },
  { id: "113", label: "Dance / EDM" },
  { id: "129", label: "R&B" },
];

export default function FilterBar({ activeId, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {GENRES.map((genre) => {
        const isActive = activeId === genre.id;
        return (
          <button
            key={genre.id}
            onClick={() => onChange(genre.id)}
            disabled={disabled}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer whitespace-nowrap transition-all duration-150 border disabled:opacity-50 ${
              isActive
                ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {genre.label}
          </button>
        );
      })}
    </div>
  );
}
