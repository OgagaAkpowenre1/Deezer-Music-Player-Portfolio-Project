import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import TrackCard from "../components/TrackCard";
import TrackListHeader from "../components/TrackListHeader";
import ArtistCard from "../components/ArtistCard";
import AlbumCard from "../components/AlbumCard";
import Page from "../components/Page";

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
    <Page tint="from-[#3a3a3a]/60">
      {/* Search Input */}
      <div className="space-y-5">
        <div className="relative max-w-xl">
          <Search
            size={22}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sp-sub"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="w-full rounded-full bg-sp-input py-3 pl-12 pr-12 text-base text-white placeholder-sp-sub outline-none transition-colors hover:bg-sp-highlight focus:bg-sp-highlight focus:ring-2 focus:ring-white"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sp-sub transition-colors hover:text-white"
            >
              <X size={20} />
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
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {/* Loading Skeleton */}
        {loading && (
          <div className="animate-pulse space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-white/5" />
            ))}
          </div>
        )}

        {/* Results View */}
        {!loading && hasSearched && (
          <div>
            {results.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xl font-bold">
                  No results found for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="mt-2 text-sm text-sp-sub">
                  Please check your spelling or try different keywords.
                </p>
              </div>
            ) : activeTab === "artist" ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {results.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            ) : activeTab === "album" ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {results.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    subtitle={album.artist?.name}
                  />
                ))}
              </div>
            ) : (
              <div>
                <TrackListHeader numbered={false} />
                {results.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial Empty State */}
        {!loading && !hasSearched && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <Search size={40} className="text-sp-muted" />
            <p className="text-xl font-bold">Find your next favourite song</p>
            <p className="text-sm text-sp-sub">
              Search for artist names, song titles or albums in the Deezer
              catalog.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
