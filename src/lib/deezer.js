import snapshot from "./deezerSnapshot.json";

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;

/**
 * Fetch wrapper with timeout and retry logic.
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      // Deezer occasionally returns 200 with an error payload: { error: { message: ... } }
      if (data && data.error) {
        throw new Error(data.error.message || "Deezer API error");
      }

      return data;
    } catch (err) {
      clearTimeout(timer);
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) throw err;
      // Exponential backoff: 300ms, 600ms...
      await new Promise((res) => setTimeout(res, attempt * 300));
    }
  }
}

/**
 * Fetch charts with automatic fallback to static snapshot.
 */
export async function getChart() {
  try {
    return await fetchWithRetry("/api/chart");
  } catch (err) {
    console.warn("API fetch failed for chart. Using snapshot fallback.", err);
    return snapshot.chart;
  }
}

/**
 * Search tracks, artists, or albums with fallback.
 */
export async function searchDeezer(query, type = "") {
  if (!query?.trim()) return { data: [] };

  const endpoint = type
    ? `/api/search?q=${encodeURIComponent(query)}&type=${type}`
    : `/api/search?q=${encodeURIComponent(query)}`;

  try {
    return await fetchWithRetry(endpoint);
  } catch (err) {
    console.warn(`Search failed for "${query}". Returning fallback.`, err);
    return { data: [], fallback: true };
  }
}

/**
 * Fetch fresh track details by ID (critical for retrieving valid preview URLs).
 */
export async function getTrack(id) {
  try {
    return await fetchWithRetry(`/api/track/${id}`);
  } catch (err) {
    console.warn(`Failed to fetch fresh track ${id}.`, err);
    const fallbackTrack = snapshot.chart.tracks.data.find(
      (t) => t.id === Number(id),
    );
    return fallbackTrack || null;
  }
}
