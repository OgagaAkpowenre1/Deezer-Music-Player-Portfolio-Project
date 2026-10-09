export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Album ID required" });

  try {
    const response = await fetch(`https://api.deezer.com/album/${id}`);
    const data = await response.json();
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
