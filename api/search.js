export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, type } = req.query;

  console.log("[API/SEARCH] Incoming request:", { q, type });

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  // Construct search path
  // If type is artist, album, or track, hit /search/artist, /search/album, or /search/track.
  // Otherwise, default to standard track search /search?q=...
  let targetUrl = "";
  if (type && ["artist", "album", "track"].includes(type)) {
    targetUrl = `https://api.deezer.com/search/${type}?q=${encodeURIComponent(q.trim())}`;
  } else {
    targetUrl = `https://api.deezer.com/search?q=${encodeURIComponent(q.trim())}`;
  }

  console.log("[API/SEARCH] Fetching upstream Deezer URL:", targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MusicPlayer/1.0)",
      },
    });

    if (!response.ok) {
      console.error("[API/SEARCH] Upstream HTTP error:", response.status);
      return res
        .status(response.status)
        .json({ error: "Upstream Deezer error" });
    }

    const data = await response.json();
    console.log(
      "[API/SEARCH] Deezer responded with total results:",
      data?.total ?? data?.data?.length ?? 0,
    );

    // Cache searches for 5 minutes
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=900",
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("[API/SEARCH] Serverless catch error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal proxy error" });
  }
}
