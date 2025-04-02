import "./navbar.js";
import { cart } from "./data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  calculateDeliveryDate,
  getDeliveryOption,
} from "./data/deliveryOptions.js";
import { orders } from "./data/orders.js";
import { getProduct } from "./data/products.js";

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const productId = urlParams.get("productId");

let matchingProduct;
let matchingOrder;
let matchingOrderClass;
orders.orderItems.forEach((order) => {
  if (order.orderId === orderId) {
    matchingOrderClass = order;
    order.orderItem.forEach((product) => {
      if (product.productId === productId) {
        matchingOrder = product;
        matchingProduct = getProduct(product.productId);
      }
    });
  }
});
let deliveryProgress = 0;
let deliveryTime;
if (matchingProduct && matchingOrder) {
  const deliveryOption = getDeliveryOption(matchingOrder.deliveryOptionId);

  deliveryTime = calculateDeliveryDate(
    deliveryOption,
    matchingOrderClass.orderDate
  );

  const currentTime = dayjs();
  const orderTime = dayjs(matchingOrderClass.orderDate);

  // Calculate delivery progress more effectively using dayjs
  if (currentTime.isBefore(deliveryTime)) {
    // If still in delivery window, calculate percentage
    const totalDuration = deliveryTime.diff(orderTime);
    const elapsedDuration = currentTime.diff(orderTime);
    deliveryProgress = (elapsedDuration / totalDuration) * 100;
  } else {
    // If past delivery date, set to 100%
    deliveryProgress = 100;
  }

  // Ensure progress is never negative (in case of early order date errors)
  deliveryProgress = Math.round(Math.max(0, deliveryProgress));

  console.log(deliveryProgress);
}

// Ensure we have valid data before proceeding
if (!matchingProduct || !matchingOrder) {
  document.querySelector(".js-order-tracking").innerHTML = `
    <div class="error-message">
      Sorry, we couldn't find information for this order.
      <a class="back-to-orders-link link-primary" href="orders.html">
        Return to your orders
      </a>
    </div>
  `;
} else {
  let trackingHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${deliveryTime.format("dddd, MMMM D")}
      </div>

      <div class="product-info">
        ${
          matchingProduct.name
            ? escapeHTML(matchingProduct.name)
            : "Unknown Product"
        }
      </div>

      <div class="product-info">
        Quantity: ${matchingOrder.quantity}
      </div>

      <img class="product-image" src="${matchingProduct.image || ""}">

      <div class="progress-labels-container">
        <div class="progress-label js-progress-label-preparing">
          Preparing
        </div>
        <div class="progress-label js-progress-label-shipped">
          Shipped
        </div>
        <div class="progress-label js-progress-label-delivered">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    `;

  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;

  // Update status indicators
  if (deliveryProgress >= 0 && deliveryProgress < 50) {
    document
      .querySelector(".js-progress-label-preparing")
      .classList.add("current-status");
  } else if (deliveryProgress >= 50 && deliveryProgress < 100) {
    document
      .querySelector(".js-progress-label-shipped")
      .classList.add("current-status");
  } else if (deliveryProgress >= 100) {
    document
      .querySelector(".js-progress-label-delivered")
      .classList.add("current-status");
  }

  // Update the progress bar width to match the delivery progress
  document.querySelector(".progress-bar").style.width = `${deliveryProgress}%`;
}

// Helper function to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[match];
  });
}

cart.updateCartQuantity();
