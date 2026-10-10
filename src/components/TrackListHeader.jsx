import { Clock } from "lucide-react";

export default function TrackListHeader({ numbered = true }) {
  return (
    <div
      className={`mb-2 grid items-center gap-3 border-b border-white/10 px-3 pb-2 text-xs font-medium uppercase tracking-wider text-sp-sub ${
        numbered
          ? "grid-cols-[1.5rem_minmax(0,1fr)_3rem]"
          : "grid-cols-[minmax(0,1fr)_3rem]"
      }`}
    >
      {numbered && <span className="text-center">#</span>}
      <span>Title</span>
      <Clock size={16} className="justify-self-end" aria-label="Duration" />
    </div>
  );
}
