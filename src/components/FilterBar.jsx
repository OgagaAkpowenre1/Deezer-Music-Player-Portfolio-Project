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
    <div className="scrollbar-none flex items-center gap-2 overflow-x-auto">
      {GENRES.map((genre) => {
        const isActive = activeId === genre.id;
        return (
          <button
            key={genre.id}
            onClick={() => onChange(genre.id)}
            disabled={disabled}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
              isActive
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {genre.label}
          </button>
        );
      })}
    </div>
  );
}
