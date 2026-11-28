"use strict";
const filmGrid = document.getElementById("film-grid");
const filmStatus = document.getElementById("film-status");
const genreSelect = document.getElementById("genre");
let films = [], visibleCount = FILM_CONFIG.pageSize, requestNumber = 0;

function renderFilms() {
  const genre = genreSelect?.value || "all";
  const sort = document.getElementById("sort")?.value;
  let result = films.filter(film => genre === "all" || film.genres.includes(genre));
  if (sort === "rating") result.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  const count = filmGrid.dataset.featured ? 8 : visibleCount;
  filmGrid.replaceChildren(...result.slice(0, count).map(film => createFilmCard(film)));
  filmStatus.textContent = result.length ? `Đang hiện ${Math.min(count, result.length)}/${result.length} phim bộ trong kết quả đã tải.` : "Không tìm thấy kết quả phù hợp.";
  const more = document.getElementById("load-more");
  if (more) more.hidden = count >= result.length;
}
async function loadFilms() {
  const current = ++requestNumber;
  filmStatus.textContent = "Đang tải phim bộ...";
  filmGrid.replaceChildren();
  filmGrid.setAttribute("aria-busy", "true");
  document.getElementById("load-more")?.setAttribute("hidden", "");
  try {
    const data = await FilmAPI.list(document.getElementById("search")?.value || "");
    if (current !== requestNumber) return;
    films = data;
    visibleCount = FILM_CONFIG.pageSize;
    if (genreSelect) {
      genreSelect.replaceChildren();
      const all = document.createElement("option");
      all.value = "all"; all.textContent = "Tất cả thể loại"; genreSelect.append(all);
      [...new Set(films.flatMap(film => film.genres))].sort().forEach(genre => {
        const option = document.createElement("option"); option.value = genre; option.textContent = genre; genreSelect.append(option);
      });
    }
    renderFilms();
  } catch (error) {
    if (current !== requestNumber) return;
    filmStatus.textContent = "Chưa tải được phim.";
    showFilmError(filmGrid, error, loadFilms);
  } finally { if (current === requestNumber) filmGrid.setAttribute("aria-busy", "false"); }
}
document.getElementById("film-search")?.addEventListener("submit", event => { event.preventDefault(); loadFilms(); });
genreSelect?.addEventListener("change", () => { visibleCount = FILM_CONFIG.pageSize; renderFilms(); });
document.getElementById("sort")?.addEventListener("change", renderFilms);
document.getElementById("load-more")?.addEventListener("click", () => { visibleCount += FILM_CONFIG.pageSize; renderFilms(); });
loadFilms();
