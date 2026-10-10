export default function OptionGrid({
  options,
  onSelect,
  selectedId,
  targetId,
  resolved,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
      {options.map((track) => {
        const isSelected = selectedId === track.id;
        const isTarget = track.id === targetId;

        let buttonStyle =
          "bg-neutral-900/80 hover:bg-neutral-800/90 border-neutral-800 text-neutral-200";

        if (resolved) {
          if (isTarget) {
            buttonStyle =
              "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10";
          } else if (isSelected && !isTarget) {
            buttonStyle =
              "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10";
          } else {
            buttonStyle =
              "bg-neutral-900/40 border-neutral-800/40 text-neutral-600 opacity-60";
          }
        }

        return (
          <button
            key={track.id}
            onClick={() => !resolved && onSelect(track.id)}
            disabled={resolved}
            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer disabled:cursor-default ${buttonStyle}`}
          >
            {/* Show cover art on resolve; show placeholder note while guessing */}
            <div className="w-12 h-12 rounded-xl bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center border border-neutral-700/50">
              {resolved ? (
                <img
                  src={
                    track.album?.cover_medium || track.artist?.picture_medium
                  }
                  alt={track.title}
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <span className="text-neutral-500 text-xs font-mono font-bold">
                  ?
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate leading-tight">
                {track.title}
              </p>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {track.artist?.name}
              </p>
            </div>

            {resolved && isTarget && (
              <span className="text-emerald-400 text-sm font-bold pr-1">✓</span>
            )}
            {resolved && isSelected && !isTarget && (
              <span className="text-rose-400 text-sm font-bold pr-1">✕</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
