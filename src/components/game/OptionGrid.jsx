import { Check, Music, X } from "lucide-react";

export default function OptionGrid({
  options,
  onSelect,
  selectedId,
  targetId,
  resolved,
}) {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((track) => {
        const isSelected = selectedId === track.id;
        const isTarget = track.id === targetId;

        let buttonStyle = "bg-white/5 hover:bg-white/10 text-white";

        if (resolved) {
          if (isTarget) {
            buttonStyle = "bg-sp-green/15 text-white ring-1 ring-sp-green";
          } else if (isSelected && !isTarget) {
            buttonStyle = "bg-sp-red/15 text-white ring-1 ring-sp-red";
          } else {
            buttonStyle = "bg-white/5 text-sp-muted opacity-60";
          }
        }

        return (
          <button
            key={track.id}
            onClick={() => !resolved && onSelect(track.id)}
            disabled={resolved}
            className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors disabled:cursor-default ${buttonStyle}`}
          >
            {/* Cover art is revealed on resolve; a note icon stands in while guessing */}
            <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded bg-sp-highlight text-sp-muted">
              {resolved ? (
                <img
                  src={
                    track.album?.cover_medium || track.artist?.picture_medium
                  }
                  alt={track.title}
                  className="animate-fade-in size-full object-cover"
                />
              ) : (
                <Music size={20} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">
                {track.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-sp-sub">
                {track.artist?.name}
              </p>
            </div>

            {resolved && isTarget && (
              <Check size={20} strokeWidth={3} className="shrink-0 text-sp-green" />
            )}
            {resolved && isSelected && !isTarget && (
              <X size={20} strokeWidth={3} className="shrink-0 text-sp-red" />
            )}
          </button>
        );
      })}
    </div>
  );
}
