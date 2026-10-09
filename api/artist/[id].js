export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Artist ID required" });

  try {
    const [artistRes, topTracksRes, albumsRes] = await Promise.all([
      fetch(`https://api.deezer.com/artist/${id}`),
      fetch(`https://api.deezer.com/artist/${id}/top?limit=10`),
      fetch(`https://api.deezer.com/artist/${id}/albums?limit=20`),
    ]);

    const [artist, topTracks, albums] = await Promise.all([
      artistRes.json(),
      topTracksRes.json(),
      albumsRes.json(),
    ]);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    return res.status(200).json({
      ...artist,
      topTracks: topTracks.data || [],
      albums: albums.data || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
