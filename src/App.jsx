import { useEffect, useState } from "react";
import { getChart } from "./lib/deezer";
import TrackCard from "./components/Trackcard";

export default function App() {
  const [data, setData] = useState({ tracks: [], artists: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChartData() {
      try {
        setLoading(true);
        const chart = await getChart();

        if (isMounted) {
          setData({
            tracks: chart?.tracks?.data || [],
            artists: chart?.artists?.data || [],
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load chart data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadChartData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 font-sans antialiased">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-8 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Top Charts
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Trending tracks and popular artists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-neutral-400">
            Proxy Ready
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 space-y-12">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-neutral-900 rounded-xl border border-neutral-800"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
            {error} (Snapshot fallback active)
          </div>
        )}

        {!loading && (
          <>
            {/* Top Tracks */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-200">
                Trending Tracks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.tracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </section>

            {/* Top Artists */}
            <section className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-200">
                Top Artists
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {data.artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/40 hover:bg-neutral-800/60 transition-colors"
                  >
                    <img
                      src={artist.picture_medium}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full object-cover shadow-inner bg-neutral-800"
                      loading="lazy"
                    />
                    <span className="text-xs font-medium text-neutral-300 mt-2 truncate w-full">
                      {artist.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
