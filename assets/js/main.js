"use strict";
// Code dùng chung; bỏ các TODO giỏ hàng/giá tiền của template shop cũ.
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const active = link.getAttribute('href') === (page === 'product-detail.html' ? 'products.html' : page);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });
  try {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const nav = document.getElementById('account-nav');
    if (user && typeof user.username === 'string' && nav) {
      const name = document.createElement('span');
      name.className = 'small account-name'; name.textContent = user.username;
      const logout = document.createElement('button');
      logout.className = 'btn btn-outline-light'; logout.textContent = 'Đăng xuất';
      logout.addEventListener('click', () => {
        try { localStorage.removeItem('currentUser'); location.reload(); }
        catch { logout.textContent = 'Không lưu được'; }
      });
      nav.replaceChildren(name, logout);
    }
  } catch { /* JSON hỏng không làm vỡ trang phim. */ }
  document.querySelectorAll('form:not(#film-search):not(#auth-form)').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      let message = form.querySelector('[aria-live]');
      if (!message) { message = document.createElement('p'); message.setAttribute('aria-live', 'polite'); form.append(message); }
      message.textContent = [...form.querySelectorAll('input[required],textarea[required]')].some(input => !input.value.trim())
        ? 'Hãy nhập đủ nội dung, không chỉ khoảng trắng.' : 'Form hợp lệ. Bài demo chưa gửi thông tin đến máy chủ.';
    });
  });
});
