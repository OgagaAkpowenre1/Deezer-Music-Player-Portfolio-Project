export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Playlist ID is required" });

  try {
    const response = await fetch(`https://api.deezer.com/playlist/${id}`);
    const data = await response.json();

    // Cache playlist tracks for 12 hours on Vercel CDN
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=43200, stale-while-revalidate=86400",
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal proxy error" });
  }
}
