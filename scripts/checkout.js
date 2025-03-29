import {
  updateCartQuantity,
  cart,
  removeFromCart,
  updateQuantity,
} from "../data/cart.js";

import { products } from "../data/products.js";

import { formatCurrency } from "../utils/money.js";

import deliveryOptions from "../data/deliveryOptions.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const { productId } = cartItem;

  let matchingItem;

  products.forEach((product) => {
    if (productId === product.id) {
      matchingItem = product;
    }
  });

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === cartItem.deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();

  const deliveryDate = today.add(deliveryOption.deliveryDays, "day");

  const dateString = deliveryDate.format("dddd, MMMM D");

  cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${
    matchingItem.id
  }">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingItem.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${matchingItem.name}
              </div>
              <div class="product-price">
                $${formatCurrency(matchingItem.priceCents)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingItem.id
                  }">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${
                  matchingItem.id
                }">
                  Update
                </span>
                <input
                 class="quantity-input
                 js-quantity-input
                 js-quantity-input-${matchingItem.id}" data-product-id="${
    matchingItem.id
  }">
                <span class="link-primary save-quantity-link js-save-quantity-link" data-product-id="${
                  matchingItem.id
                }">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link"data-product-id="${
                  matchingItem.id
                }">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingItem, cartItem)}
            </div>
          </div>
        </div>`;
});

function deliveryOptionsHTML(matchingItem, cartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOptions) => {
    const today = dayjs();

    const deliveryDate = today.add(deliveryOptions.deliveryDays, "day");

    const dateString = deliveryDate.format("dddd, MMMM D");

    let priceString =
      deliveryOptions.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOptions.priceCents)} -`;

    let isChecked = deliveryOptions.id === cartItem.deliveryOptionId;

    html += ` <div class="delivery-option">
                <input type="radio" ${
                  isChecked ? "checked" : ""
                } class="delivery-option-input" name="delivery-option-${
      matchingItem.id
    }">
                <div>
                  <div class="delivery-option-date">
                    ${dateString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} Shipping
                  </div>
                </div>
              </div>
    `;
  });

  return html;
}

document.querySelector(".order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;

    removeFromCart(productId);
    updateCartQuantity();
  });
});

updateCartQuantity();

document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;

    document
      .querySelector(`.js-cart-item-container-${productId}`)
      .classList.add("is-editing-quantity");
  });
});

document.querySelectorAll(`.js-save-quantity-link`).forEach((link) => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;

    const newQuantity = Number(
      document.querySelector(`.js-quantity-input-${productId}`).value
    );

    updateQuantity(productId, newQuantity);
  });
});

document.querySelectorAll(".js-quantity-input").forEach((input) => {
  const { productId } = input.dataset;

  document
    .querySelector(`.js-quantity-input-${productId}`)
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const newQuantity = Number(
          document.querySelector(`.js-quantity-input-${productId}`).value
        );

        updateQuantity(productId, newQuantity);
      }
    });
});
