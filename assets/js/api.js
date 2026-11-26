"use strict";
// BƯỚC 2: Fetch và chuẩn hóa dữ liệu, không render trong file này.
const FilmAPI = (() => {
  async function request(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(new URL(path, FILM_CONFIG.baseURL), { signal: controller.signal });
      if (!response.ok) throw new Error(`Không tải được dữ liệu phim (HTTP ${response.status}).`);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Kết nối quá lâu, hãy thử lại.");
      throw error;
    } finally { clearTimeout(timer); }
  }
  function normalize(show) {
    if (!show || !Number.isInteger(show.id) || typeof show.name !== "string") throw new Error("Dữ liệu phim không hợp lệ.");
    // Summary của nguồn có HTML. Chỉ lấy chữ rồi đưa vào textContent khi render.
    const parsed = new DOMParser().parseFromString(`<!doctype html><html><body>${show.summary || ""}</body></html>`, "text/html");
    return {
      id: show.id, name: show.name, image: show.image?.original || show.image?.medium,
      genres: Array.isArray(show.genres) ? show.genres : [],
      year: show.premiered?.slice(0, 4) || "Chưa rõ năm",
      rating: show.rating?.average ?? null,
      summary: parsed.body.textContent.trim() || "Nguồn chưa có mô tả.",
      language: show.language || "Chưa có thông tin", status: show.status || "Chưa có thông tin",
      runtime: show.averageRuntime || show.runtime || null,
      url: show.url,
      cast: Array.isArray(show._embedded?.cast) ? show._embedded.cast : []
    };
  }
  async function list(query = "") {
    const term = query.trim();
    const data = await request(term ? `search/shows?q=${encodeURIComponent(term)}` : "shows?page=0");
    if (!Array.isArray(data)) throw new Error("API không trả về danh sách phim.");
    // search trả [{score, show}], danh sách mặc định trả [show].
    return data.map(item => normalize(term ? item.show : item));
  }
  async function detail(id) {
    if (!/^[1-9]\d{0,7}$/.test(String(id))) throw new Error("ID không hợp lệ. Hãy chọn phim từ danh sách.");
    return normalize(await request(`shows/${id}?embed=cast`));
  }
  return { list, detail };
})();
