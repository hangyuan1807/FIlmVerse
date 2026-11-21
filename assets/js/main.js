"use strict";

// TechZone Starter - JavaScript chưa hoàn chỉnh.
// Hãy tìm các dòng TODO JS và hoàn thiện theo hướng dẫn.

document.addEventListener("DOMContentLoaded", () => {
  setupProductFilter();
  setupQuantityButtons();
  setupAddToCart();
  setupCartTable();
  setupForms();
});

function setupProductFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-item");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => {
        item.classList.remove("btn-primary");
        item.classList.add("btn-outline-primary");
      });
      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-primary");

      products.forEach((product) => {
        const isVisible = filter === "all" || product.dataset.category === filter;
        product.classList.toggle("d-none", !isVisible);
      });
    });
  });
}

function setupQuantityButtons() {
  const input = document.querySelector("#quantity");
  const increaseButton = document.querySelector("#increase-btn");
  const decreaseButton = document.querySelector("#decrease-btn");
  if (!input || !increaseButton || !decreaseButton) return;

  increaseButton.addEventListener("click", () => {
    // TODO JS 01: Tăng giá trị input thêm 1.
    console.log("Hãy hoàn thiện chức năng tăng số lượng");
  });

  decreaseButton.addEventListener("click", () => {
    // TODO JS 02: Giảm 1 nhưng không được nhỏ hơn 1.
    console.log("Hãy hoàn thiện chức năng giảm số lượng");
  });
}

function setupAddToCart() {
  const addButton = document.querySelector("#add-to-cart-btn");
  const quantityInput = document.querySelector("#quantity");
  const cartCount = document.querySelector("#cart-count");
  const message = document.querySelector("#cart-message");
  if (!addButton || !quantityInput || !cartCount || !message) return;

  addButton.addEventListener("click", () => {
    // TODO JS 03: Lấy số lượng, cộng vào cartCount và hiển thị thông báo.
    message.textContent = "Chức năng đang chờ học sinh hoàn thiện.";
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function updateCartTotals() {
  // TODO JS 04:
  // 1. Duyệt qua từng hàng trong #cart-items.
  // 2. Lấy data-price và số lượng.
  // 3. Cập nhật .line-total.
  // 4. Cộng tạm tính và cập nhật #subtotal, #grand-total.
  console.log("Hãy hoàn thiện hàm tính tổng giỏ hàng");
}

function setupCartTable() {
  const cartItems = document.querySelector("#cart-items");
  if (!cartItems) return;

  cartItems.addEventListener("input", (event) => {
    if (event.target.matches(".cart-quantity")) {
      // TODO JS 05: Kiểm tra số lượng tối thiểu là 1 rồi gọi updateCartTotals().
    }
  });

  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-item");
    if (!removeButton) return;

    // TODO JS 06: Xóa hàng chứa nút vừa nhấn và tính lại tổng.
  });
}

function setupForms() {
  document.querySelectorAll("#checkout-form, #contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      // TODO JS 07: Hiển thị thông báo thành công phù hợp cho từng form.
      const message = form.querySelector("[aria-live='polite']");
      if (message) message.textContent = "Biểu mẫu hợp lệ. Hãy hoàn thiện thông báo của bạn.";
    });
  });
}
