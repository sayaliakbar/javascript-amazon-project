import { cart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { formatCurrency } from "../../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../data/deliveryOptions.js";
import renderPaymentSummary from "./paymentSummary.js";
import renderCheckoutHeader from "./checkoutHeader.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  // Check if cart is empty or null
  if (!cart.cartItems || cart.cartItems.length === 0) {
    cartSummaryHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty.</p>
        <a class="back-to-orders-link link-primary" href="javascript-amazon-project/index.html">
        Continue shopping
      </a>
      </div>
    `;
  } else {
    cart.cartItems.forEach((cartItem) => {
      const { productId, deliveryOptionId } = cartItem;
      const matchingItem = getProduct(productId);
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      const deliveryDate = dayjs(calculateDeliveryDate(deliveryOption));

      cartSummaryHTML += `<div class="cart-item-container js-cart-item-container js-cart-item-container-${
        matchingItem.id
      }">
          <div class="delivery-date">
            Delivery date: ${deliveryDate.format("dddd, MMMM D")}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingItem.image}">
            <div class="cart-item-details">
              <div class="product-name js-product-name-${matchingItem.id}">
                ${matchingItem.name}
              </div>
              <div class="product-price js-product-price-${matchingItem.id}">
                $${formatCurrency(matchingItem.priceCents)}
              </div>
              <div class="product-quantity js-product-quantity-${
                matchingItem.id
              }">
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
                <span class="delete-quantity-link link-primary js-delete-link 
                js-delete-link-${matchingItem.id}" 
                data-product-id="${matchingItem.id}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options js-delivery-options-${
              matchingItem.id
            }">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              <div class="delivery-options-container">${deliveryOptionsHTML(
                matchingItem,
                cartItem
              )}</div>
              
            </div>
          </div>
        </div>`;
    });
  }

  function deliveryOptionsHTML(matchingItem, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const deliveryDate = dayjs(calculateDeliveryDate(deliveryOption));

      let priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      let isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` <div class="delivery-option js-delivery-option
      js-delivery-option-${matchingItem.id}-${deliveryOption.id}"  
      data-product-id="${matchingItem.id}"
      data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${
                  isChecked ? "checked" : ""
                } class="delivery-option-input js-delivery-option-input-${
        matchingItem.id
      }-${deliveryOption.id}" name="delivery-option-${matchingItem.id}">
                <div>
                  <div class="delivery-option-date">
                    ${deliveryDate.format("dddd, MMMM D")}
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

  const orderSummaryContainer = document.querySelector(".js-order-summary");

  if (orderSummaryContainer) {
    orderSummaryContainer.innerHTML = cartSummaryHTML;
  }

  // Only attach event listeners if cart is not empty
  if (cart.cartItems && cart.cartItems.length > 0) {
    document.querySelectorAll(".js-delete-link").forEach((link) => {
      link.addEventListener("click", () => {
        const { productId } = link.dataset;
        cart.removeFromCart(productId);
        renderPaymentSummary();
        renderCheckoutHeader();
        cart.updateCartQuantity();
      });
    });

    cart.updateCartQuantity();

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

        cart.updateQuantity(productId, newQuantity);
        renderPaymentSummary();
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

            cart.updateQuantity(productId, newQuantity);
          }
        });
    });

    document.querySelectorAll(".js-delivery-option").forEach((element) => {
      element.addEventListener("click", () => {
        const { productId, deliveryOptionId } = element.dataset;
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  } else {
    // Still update cart quantity even when empty
    cart.updateCartQuantity();
  }
}

export default renderOrderSummary;
