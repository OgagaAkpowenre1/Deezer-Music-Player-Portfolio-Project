export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Deezer chart endpoint: /chart/{genre_id} (0 = Worldwide All)
  const genreId = req.query.genre || '0';
  const targetUrl = `https://api.deezer.com/chart/${genreId}`

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MusicPlayer/1.0)",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Upstream Deezer error" });
    }

    const data = await response.json();

    // Cache on CDN for 1 hour; serve stale up to 24h during background revalidation
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal proxy error" });
  }
}
