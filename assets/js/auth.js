"use strict";
// Giữ key users/currentUser để dữ liệu tài khoản cũ còn dùng được.
function setupAuthForm(mode) {
  const form = document.getElementById("auth-form");
  const feedback = document.getElementById("auth-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    try {
      if (!form.reportValidity()) return;
      const email = document.getElementById("email").value.trim().toLowerCase();
      // Không trim mật khẩu: khoảng trắng là một phần của mật khẩu đã đăng ký.
      const password = document.getElementById("password").value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email không hợp lệ.");
      const data = JSON.parse(localStorage.getItem("users") || "[]");
      if (!Array.isArray(data)) throw new Error("Dữ liệu users lỗi. Hãy kiểm tra Local Storage.");
      const users = data.filter(user => user && typeof user.email === "string" && typeof user.password === "string");
      if (mode === "register") {
        const username = document.getElementById("username").value.trim();
        if (username.length < 6 || username.length > 60) throw new Error("Tên hiển thị cần từ 6 đến 60 ký tự.");
        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) throw new Error("Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, chữ thường và số.");
        if (users.some(user => user.email.trim().toLowerCase() === email)) throw new Error("Email đã được đăng ký.");
        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        feedback.textContent = "Đã tạo tài khoản demo. Bạn có thể đăng nhập.";
        return;
      }
      const user = users.find(user => user.email.trim().toLowerCase() === email && user.password === password);
      if (!user) throw new Error("Email hoặc mật khẩu không đúng.");
      // Phiên chỉ giữ tên/email, không sao chép cả object chứa mật khẩu.
      localStorage.setItem("currentUser", JSON.stringify({ username: user.username, email: user.email }));
      location.href = "./index.html";
    } catch (error) { feedback.textContent = error.message || "Không lưu được dữ liệu."; }
  });
}
