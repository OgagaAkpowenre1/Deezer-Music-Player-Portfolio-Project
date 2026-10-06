export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Valid numeric track ID is required" });
  }

  try {
    const response = await fetch(`https://api.deezer.com/track/${id}`, {
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

    // Shorter cache (5 minutes) so preview URLs remain fresh
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal proxy error" });
  }
}
