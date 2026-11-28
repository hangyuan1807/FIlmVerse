"use strict";
function setPoster(image, url, title) {
  let safe = FILM_CONFIG.placeholder;
  try { const parsed = new URL(url); if (["http:", "https:"].includes(parsed.protocol)) safe = parsed.href; } catch {}
  image.src = safe;
  image.alt = title;
  image.onerror = () => { image.onerror = null; image.src = FILM_CONFIG.placeholder; };
}
function showFilmError(container, error, retry) {
  container.replaceChildren();
  const message = document.createElement("p");
  message.className = "alert alert-danger";
  message.setAttribute("role", "alert");
  message.textContent = error.message || "Không tải được dữ liệu, hãy kiểm tra mạng.";
  container.append(message);
  if (retry) {
    const button = document.createElement("button");
    button.className = "btn btn-outline-light";
    button.textContent = "Thử lại";
    button.addEventListener("click", retry);
    container.append(button);
  }
}
// BƯỚC 3: Tạo một card từ object chung; link luôn giữ đúng ID nguồn.
function createFilmCard(film, removable = false) {
  const column = document.createElement("div");
  column.className = "col-6 col-md-4 col-lg-3";
  const card = document.createElement("article");
  card.className = "card movie-card";
  const poster = document.createElement("a");
  poster.className = "poster-frame";
  poster.href = `product-detail.html?id=${film.id}`;
  const image = document.createElement("img");
  image.loading = "lazy";
  setPoster(image, film.image, film.name);
  poster.append(image);
  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";
  const title = document.createElement("h2");
  title.className = "h6";
  title.textContent = film.name;
  const meta = document.createElement("p");
  meta.className = "small text-secondary";
  meta.textContent = `${film.year} · ${film.rating === null ? "Chưa chấm điểm" : `${film.rating}/10 TVmaze`}`;
  const link = document.createElement("a");
  link.className = "btn btn-outline-light mt-auto";
  link.href = poster.href;
  link.textContent = "Xem chi tiết";
  body.append(title, meta, link);
  if (removable) {
    const remove = document.createElement("button");
    remove.className = "btn btn-link text-secondary mt-2";
    remove.textContent = "Bỏ khỏi watchlist";
    remove.addEventListener("click", () => {
      try { Watchlist.remove(film.id); column.remove(); document.dispatchEvent(new Event("watchlist-updated")); }
      catch { remove.textContent = "Không lưu được. Thử lại"; }
    });
    body.append(remove);
  }
  card.append(poster, body);
  column.append(card);
  return column;
}
