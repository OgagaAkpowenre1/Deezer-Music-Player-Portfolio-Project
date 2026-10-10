import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import TrackCard from "../components/TrackCard";
import TrackListHeader from "../components/TrackListHeader";
import ArtistCard from "../components/ArtistCard";
import TriviaGame from "../components/game/TriviaGame";
import Page from "../components/Page";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState("0");
  const [data, setData] = useState({ tracks: [], artists: [] });
  const [loading, setLoading] = useState(true);
  const [greeting] = useState(getGreeting);

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
    <Page>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        {greeting}
      </h1>

      <div className="mt-6">
        <FilterBar
          activeId={selectedGenre}
          onChange={setSelectedGenre}
          disabled={loading}
        />
      </div>

      <div className="mt-8 space-y-12">
        {loading ? (
          <div className="animate-pulse space-y-10">
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-14 rounded-md bg-white/5" />
              ))}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-white/5" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <section>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
                Top 10 Songs
              </h2>
              <TrackListHeader />
              <div>
                {data.tracks.map((track, idx) => (
                  <TrackCard key={track.id} track={track} rank={idx + 1} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
                Top 10 Artists
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {data.artists.map((artist, idx) => (
                  <ArtistCard key={artist.id} artist={artist} rank={idx + 1} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Mini-Game Showcase Section */}
        <section>
          <TriviaGame />
        </section>
      </div>
    </Page>
  );
}
