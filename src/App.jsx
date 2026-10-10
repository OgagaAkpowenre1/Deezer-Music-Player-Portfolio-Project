import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import BottomPlayer from "./components/BottomPlayer";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import MobileNav from "./components/layout/MobileNav";
import HomePage from "./pages/HomePage";
import ArtistPage from "./pages/ArtistPage";
import AlbumPage from "./pages/AlbumPage";
import TrackPage from "./pages/TrackPage";
import SearchPage from "./pages/SearchPage";

function Layout() {
  const { currentTrack } = usePlayer();
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Start every page at the top, like Spotify does
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col bg-black text-white">
      <div
        className={`flex min-h-0 flex-1 gap-2 p-2 ${
          currentTrack ? "pb-0 md:pb-0" : ""
        }`}
      >
        <Sidebar />

        <main
          ref={mainRef}
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 56)}
          className="sp-scroll relative min-w-0 flex-1 overflow-y-auto rounded-lg bg-sp-panel"
        >
          <TopBar scrolled={scrolled} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/track/:id" element={<TrackPage />} />
          </Routes>
        </main>
      </div>

      <BottomPlayer />
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </PlayerProvider>
  );
}
