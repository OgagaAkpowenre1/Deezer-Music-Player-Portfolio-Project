import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import BottomPlayer from "./components/BottomPlayer";
import HomePage from "./pages/HomePage";
import ArtistPage from "./pages/ArtistPage";
import AlbumPage from "./pages/AlbumPage";
import TrackPage from "./pages/TrackPage";
import SearchPage from "./pages/SearchPage";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b border-neutral-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-black tracking-tight flex items-center gap-2"
        >
          <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-neutral-950 text-xs font-bold">
            ▶
          </span>
          SoundVault
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-emerald-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              location.pathname === "/search"
                ? "bg-neutral-800 text-emerald-400 border border-neutral-700"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <span>🔍</span> Search
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased pb-28">
          <Navigation />

          <main className="max-w-6xl mx-auto p-6 md:p-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/album/:id" element={<AlbumPage />} />
              <Route path="/track/:id" element={<TrackPage />} />
            </Routes>
          </main>

          <BottomPlayer />
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
}
