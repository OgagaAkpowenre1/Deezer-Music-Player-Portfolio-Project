import { Link, useLocation, useNavigate } from "react-router-dom";
import { AudioLines, ChevronLeft, ChevronRight } from "lucide-react";

export default function TopBar({ scrolled }) {
  const navigate = useNavigate();
  useLocation(); // re-render on navigation so the back button state stays fresh
  // react-router stores the history position in history.state.idx
  const canGoBack = (window.history.state?.idx ?? 0) > 0;

  const circleBtn =
    "grid size-8 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black disabled:opacity-40 disabled:hover:bg-black/70";

  return (
    <header
      className={`sticky top-0 z-20 -mb-16 flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 transition-colors duration-200 ${
        scrolled ? "bg-sp-panel" : "bg-transparent"
      }`}
    >
      {/* Mobile-only brand mark (sidebar is hidden on small screens) */}
      <Link
        to="/"
        aria-label="SoundVault home"
        className="md:hidden mr-1 grid size-8 place-items-center rounded-full bg-sp-green text-black"
      >
        <AudioLines size={18} strokeWidth={2.75} />
      </Link>

      <button
        onClick={() => navigate(-1)}
        disabled={!canGoBack}
        aria-label="Go back"
        className={circleBtn}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => navigate(1)}
        aria-label="Go forward"
        className={circleBtn}
      >
        <ChevronRight size={22} />
      </button>
    </header>
  );
}
