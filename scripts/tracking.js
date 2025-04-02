import { cart } from "./data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  calculateDeliveryDate,
  getDeliveryOption,
} from "./data/deliveryOptions.js";
import { orders } from "./data/orders.js";
import { getProduct } from "./data/products.js";
const today = dayjs();
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

const deliveryOption = getDeliveryOption(matchingOrder.deliveryOptionId);

const deliveryDate = calculateDeliveryDate(
  deliveryOption,
  matchingOrderClass.orderDate
);

const currentTime = today;
const orderTime = matchingOrderClass.orderDate;

console.log(currentTime);
console.log(orderTime);
console.log(deliveryDate);
import "./navbar.js";

let trackingHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${deliveryDate.format("dddd, MMMM D")}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${matchingOrder.quantity}
      </div>

      <img class="product-image" src=${matchingProduct.image}>

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    `;

document.querySelector(".js-order-tracking").innerHTML = trackingHTML;
cart.updateCartQuantity();
