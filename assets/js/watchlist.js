"use strict";
const savedGrid = document.getElementById("saved-grid");
const savedStatus = document.getElementById("saved-status");
let savedRequest = 0;
async function loadWatchlist() {
  const current = ++savedRequest;
  const ids = Watchlist.read();
  savedGrid.replaceChildren();
  savedStatus.textContent = ids.length ? "Đang tải phim đã lưu..." : "Watchlist đang trống. Hãy chọn phim từ kho phim.";
  savedGrid.setAttribute("aria-busy", "true");
  let failed = 0;
  // Tải theo nhóm 3 để không tạo hàng chục request cùng lúc (nguồn có rate limit).
  for (let start = 0; start < ids.length; start += 3) {
    const group = await Promise.allSettled(ids.slice(start, start + 3).map(id => FilmAPI.detail(id)));
    if (current !== savedRequest) return;
    group.forEach((result, index) => {
      if (result.status === "fulfilled") savedGrid.append(createFilmCard(result.value, true));
      else {
        failed++;
        const item = document.createElement("div");
        item.className = "col-12";
        const text = document.createElement("p");
        text.textContent = `Chưa tải được phim ID ${ids[start + index]}. Bạn có thể thử lại hoặc bỏ ID này.`;
        const remove = document.createElement("button");
        remove.className = "btn btn-outline-light mb-3"; remove.textContent = "Bỏ ID này";
        remove.addEventListener("click", () => {
          try { Watchlist.remove(ids[start + index]); loadWatchlist(); }
          catch { savedStatus.textContent = "Không lưu được thay đổi."; }
        });
        item.append(text, remove); savedGrid.append(item);
      }
    });
  }
  savedGrid.setAttribute("aria-busy", "false");
  if (ids.length) savedStatus.textContent = failed ? `${failed} phim chưa tải được. Bấm Tải lại để thử lại.` : `${ids.length} phim đã lưu trên trình duyệt.`;
}
document.getElementById("reload-saved").addEventListener("click", loadWatchlist);
// Đọc lại ID để request cũ không đưa phim vừa xóa trở lại khi còn đang tải.
document.addEventListener("watchlist-updated", loadWatchlist);
window.addEventListener("storage", event => { if (event.key === FILM_CONFIG.watchlistKey) loadWatchlist(); });
loadWatchlist();
