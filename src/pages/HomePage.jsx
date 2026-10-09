import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import TrackCard from "../components/TrackCard";
import ArtistCard from "../components/ArtistCard";

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState("0");
  const [data, setData] = useState({ tracks: [], artists: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/chart?genre=${selectedGenre}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        setData({
          tracks: json.tracks?.data?.slice(0, 10) || [],
          artists: json.artists?.data?.slice(0, 10) || [],
        });
      })
      .catch((err) => console.error("Failed to load chart:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 font-sans antialiased">
      <header className="max-w-6xl mx-auto space-y-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Music Charts
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Top 10 tracks and artists updated in real time
          </p>
        </div>
        <FilterBar
          activeId={selectedGenre}
          onChange={setSelectedGenre}
          disabled={loading}
        />
      </header>

      <main className="max-w-6xl mx-auto py-8 space-y-12 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-neutral-900 rounded-xl border border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-200">
                Top 10 Songs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.tracks.map((track, idx) => (
                  <TrackCard key={track.id} track={track} rank={idx + 1} />
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-200">
                Top 10 Artists
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {data.artists.map((artist, idx) => (
                  <ArtistCard key={artist.id} artist={artist} rank={idx + 1} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
