"use strict";
const filmDetail = document.getElementById("film-detail");
async function loadDetail() {
  filmDetail.textContent = "Đang tải chi tiết...";
  filmDetail.setAttribute("aria-busy", "true");
  try {
    // BƯỚC 4: Đọc ID từ URL, fetch lại để refresh/mở trực tiếp vẫn đúng phim.
    const id = new URLSearchParams(location.search).get("id");
    const film = await FilmAPI.detail(id);
    const view = document.getElementById("detail-template").content.cloneNode(true);
    setPoster(view.querySelector("img"), film.image, film.name);
    view.querySelector("h1").textContent = film.name;
    view.querySelector(".film-meta").textContent = [film.year, ...film.genres].join(" · ");
    view.querySelector(".film-summary").textContent = film.summary;
    view.querySelector(".film-rating").textContent = film.rating === null ? "Chưa có điểm từ TVmaze" : `${film.rating}/10 · TVmaze`;
    view.querySelector(".film-language").textContent = film.language;
    view.querySelector(".film-runtime").textContent = film.runtime ? `${film.runtime} phút/tập` : "Chưa có thông tin";
    view.querySelector(".film-status").textContent = film.status;
    view.querySelector(".film-cast").textContent = film.cast.slice(0, 8).map(item => item.person?.name).filter(Boolean).join(", ") || "Nguồn chưa có thông tin diễn viên.";
    view.querySelector(".film-source").href = `https://www.tvmaze.com/shows/${film.id}`;
    const button = view.querySelector("#save-film");
    const feedback = view.querySelector("#save-feedback");
    function updateButton() {
      const saved = Watchlist.read().includes(film.id);
      button.textContent = saved ? "Bỏ khỏi watchlist" : "Lưu watchlist";
      button.setAttribute("aria-pressed", String(saved));
    }
    updateButton();
    button.addEventListener("click", () => {
      try { const saved = Watchlist.toggle(film.id); updateButton(); feedback.textContent = saved ? "Đã lưu trên trình duyệt này." : "Đã bỏ khỏi watchlist."; }
      catch (error) { feedback.textContent = error.message || "Không lưu được dữ liệu."; }
    });
    window.addEventListener("storage", event => { if (event.key === FILM_CONFIG.watchlistKey) updateButton(); });
    document.title = `${film.name} | FilmVerse`;
    filmDetail.replaceChildren(view);
  } catch (error) { showFilmError(filmDetail, error, loadDetail); }
  finally { filmDetail.setAttribute("aria-busy", "false"); }
}
loadDetail();
