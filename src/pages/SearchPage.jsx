import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import TrackCard from "../components/TrackCard";
import ArtistCard from "../components/ArtistCard";

const SEARCH_TABS = [
  { id: "", label: "Tracks (All)" },
  { id: "artist", label: "Artists" },
  { id: "album", label: "Albums" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      console.log("[SearchPage] Query cleared or empty, resetting state.");
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setHasSearched(true);

    const typeParam = activeTab ? `&type=${activeTab}` : "";
    const fetchUrl = `/api/search?q=${encodeURIComponent(trimmed)}${typeParam}`;

    console.log(`[SearchPage] 🚀 Dispatching search:`, {
      rawInput: query,
      debouncedQuery: trimmed,
      tab: activeTab || "all/tracks",
      url: fetchUrl,
    });

    fetch(fetchUrl)
      .then((res) => {
        console.log(
          `[SearchPage] Response status: ${res.status} (${res.statusText})`,
        );
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;

        console.log("[SearchPage] 📦 Raw JSON received from API:", json);

        // Standard Deezer search endpoints (/search, /search/artist, /search/album) return { data: [...] }
        if (Array.isArray(json.data)) {
          console.log(
            `[SearchPage] ✅ Parsed ${json.data.length} items from json.data`,
          );
          setResults(json.data);
        } else if (json.tracks?.data) {
          // Fallback if Deezer returns an editorial grouped structure
          console.log(
            `[SearchPage] ⚠️ Received grouped structure, using tracks (${json.tracks.data.length} items)`,
          );
          setResults(json.tracks.data);
        } else {
          console.warn(
            "[SearchPage] ⚠️ No recognized array found in response:",
            json,
          );
          setResults([]);
        }
      })
      .catch((err) => {
        console.error("[SearchPage] ❌ Fetch failed:", err);
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) {
          console.log("[SearchPage] Finished request cycle.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, activeTab]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 text-lg">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, artists, or albums..."
            className="w-full pl-12 pr-10 py-3.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm md:text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-200 text-sm cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          {SEARCH_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  console.log(
                    `[SearchPage] Tab switched to: "${tab.label}" (${tab.id || "all"})`,
                  );
                  setActiveTab(tab.id);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm"
                    : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-900 rounded-xl border border-neutral-800"
            />
          ))}
        </div>
      )}

      {/* Results View */}
      {!loading && hasSearched && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-sm">
              No results found for &ldquo;
              <span className="text-neutral-300">{debouncedQuery}</span>&rdquo;
            </div>
          ) : (
            <div>
              {/* Artist Tab */}
              {activeTab === "artist" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {results.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : activeTab === "album" ? (
                /* Album Tab */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {results.map((album) => (
                    <Link
                      key={album.id}
                      to={`/album/${album.id}`}
                      className="group p-3 bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-800/60 transition-all flex flex-col items-center text-center"
                    >
                      <img
                        src={album.cover_medium}
                        alt={album.title}
                        className="w-full aspect-square rounded-lg object-cover group-hover:scale-105 transition-transform"
                      />
                      <p className="mt-2 text-sm font-semibold text-neutral-200 truncate w-full">
                        {album.title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate w-full">
                        {album.artist?.name}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Default / Tracks Tab */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && !hasSearched && (
        <div className="text-center py-20 text-neutral-600 text-sm">
          Type artist names, song titles, or albums to explore Deezer's catalog.
        </div>
      )}
    </div>
  );
}
