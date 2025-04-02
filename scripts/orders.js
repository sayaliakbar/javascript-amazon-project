import "./navbar.js";
import { cart } from "./data/cart.js";
import { orders } from "./data/orders.js";
import { formatCurrency } from "../utils/money.js";
import { orderItemsHTML } from "./orders/orderProducts.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

let orderList = "";

if (!orders.orderItems || orders.orderItems.length === 0) {
  orderList = `<div class="no-orders-message">
    <p>You have no orders yet.</p>
    <a href="index.html" class="continue-shopping-link">Continue Shopping</a>
  </div>`;
} else {
  orders.orderItems.forEach((item) => {
    const orderTime = dayjs(item.orderDate);

    orderList += `<div class="order-container">

          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTime.format("MMMM D")}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(item.orderPriceCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${item.orderId}</div>
            </div>
          </div>

           <div class="order-details-grid js-order-details-grid">
           ${orderItemsHTML(item)}
           </div>
          </div>
        </div>`;
  });
}

document.querySelector(".js-orders-grid").innerHTML = orderList;
document.querySelectorAll(".js-buy-again-button").forEach((button) => {
  button.addEventListener("click", () => {
    const { productId } = button.dataset;

    cart.addToCart(productId);
    cart.updateCartQuantity();
  });
});
cart.updateCartQuantity();
