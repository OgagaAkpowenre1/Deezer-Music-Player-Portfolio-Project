import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import TrackCard from "../components/TrackCard";
import TrackListHeader from "../components/TrackListHeader";
import AlbumCard from "../components/AlbumCard";
import Page from "../components/Page";
import PageMessage from "../components/PageMessage";
import { usePlayer } from "../context/PlayerContext";

export default function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artist/${id}`)
      .then((r) => r.json())
      .then((data) => setArtist(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageMessage loading>Loading artist…</PageMessage>;
  if (!artist || artist.error)
    return <PageMessage>Artist not found.</PageMessage>;

  const topTracks = artist.topTracks || [];
  const artistIsCurrent = topTracks.some((t) => t.id === currentTrack?.id);
  const showPause = artistIsCurrent && isPlaying;

  return (
    <Page tint="from-[#44397a]/70">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <img
          src={artist.picture_big}
          alt={artist.name}
          className="size-48 rounded-full object-cover shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:size-56"
        />
        <div className="min-w-0 space-y-2 text-center sm:text-left">
          <span className="text-sm font-bold">Artist</span>
          <h1 className="break-words text-5xl font-black leading-none tracking-tighter md:text-6xl lg:text-7xl">
            {artist.name}
          </h1>
          <p className="text-sm text-sp-sub">
            {Number(artist.nb_fan).toLocaleString()} fans • {artist.nb_album}{" "}
            releases
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8">
        <button
          onClick={() => topTracks[0] && playTrack(topTracks[0])}
          disabled={!topTracks[0]?.preview}
          aria-label={showPause ? "Pause" : "Play top track"}
          className="grid size-14 place-items-center rounded-full bg-sp-green text-black transition-transform hover:scale-105 hover:bg-sp-green-hover active:scale-95 disabled:opacity-40"
        >
          {showPause ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Popular Tracks */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Popular</h2>
        <TrackListHeader />
        <div>
          {topTracks.map((track, i) => (
            <TrackCard key={track.id} track={track} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Albums Discography */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Discography</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          {artist.albums?.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              subtitle={album.release_date?.slice(0, 4)}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}
