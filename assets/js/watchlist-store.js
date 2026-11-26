"use strict";
// Chỉ lưu ID; tên, ảnh và điểm khi mở watchlist phải lấy lại từ API.
// Đây là watchlist trên trình duyệt, không phải dữ liệu đồng bộ tài khoản.
const Watchlist = {
  read() {
    try {
      const data = JSON.parse(localStorage.getItem(FILM_CONFIG.watchlistKey) || "[]");
      return Array.isArray(data) ? [...new Set(data.filter(id => Number.isInteger(id) && id > 0 && id <= 99999999))].slice(0, 30) : [];
    } catch { return []; }
  },
  toggle(id) {
    const ids = this.read();
    const next = ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
    if (next.length > 30) throw new Error("Bài demo lưu tối đa 30 phim. Hãy bỏ bớt trước khi thêm.");
    localStorage.setItem(FILM_CONFIG.watchlistKey, JSON.stringify(next));
    return next.includes(id);
  },
  remove(id) { localStorage.setItem(FILM_CONFIG.watchlistKey, JSON.stringify(this.read().filter(item => item !== id))); }
};
