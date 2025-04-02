import renderCheckoutHeader from "../checkout/checkoutHeader.js";
import renderOrderSummary from "../checkout/orderSummary.js";
import { deliveryOptions } from "./deliveryOptions.js";

export class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      const cartElement = document.querySelector(
        `.js-quantity-selector-${matchingItem.productId}`
      );

      matchingItem.quantity += cartElement ? Number(cartElement.value) : 1;
    } else {
      const cartElement = document.querySelector(
        `.js-quantity-selector-${productId}`
      );

      // Use default quantity of 1 if element doesn't exist
      const itemsQuantity = cartElement ? Number(cartElement.value) : 1;

      this.cartItems.push({
        productId,
        quantity: itemsQuantity,
        deliveryOptionId: "1",
      });

      if (cartElement) {
        cartElement.classList.add("added-to-cart-visible");
      }
    }

    this.saveToLocalStorage();
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (productId !== cartItem.productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;

    renderOrderSummary();
    this.saveToLocalStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateCartQuantity() {
    const cartQuantity = this.calculateCartQuantity();

    const amazonCartQuantity = document.querySelector(".js-cart-quantity");

    if (amazonCartQuantity) {
      amazonCartQuantity.innerText = cartQuantity ? cartQuantity : "";
    }
  }

  updateQuantity(productId, newQuantity) {
    // Data logic
    if (newQuantity >= 0 && newQuantity < 1000) {
      if (newQuantity === 0) {
        this.removeFromCart(productId);
        this.updateCartQuantity();
        // UI update should be handled elsewhere
        renderCheckoutHeader();
        return;
      }

      // UI updates mixed with data logic
      document.querySelector(`.js-quantity-label-${productId}`).innerText =
        newQuantity;

      this.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.quantity = newQuantity;
        }
      });

      // More UI updates
      document
        .querySelector(`.js-cart-item-container-${productId}`)
        .classList.remove("is-editing-quantity");

      this.saveToLocalStorage();
      this.updateCartQuantity();

      // More UI updates
      document
        .querySelector(`.js-quantity-input-${productId}`)
        .classList.remove("quantity-input-error");
    } else {
      // UI update for error state
      document
        .querySelector(`.js-quantity-input-${productId}`)
        .classList.add("quantity-input-error");
    }

    // More UI updates
    document.querySelector(`.js-quantity-input-${productId}`).value = "";
    renderCheckoutHeader();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    let isOptionId = false;

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        isOptionId = true;
      }
    });

    if (matchingItem && isOptionId) {
      matchingItem.deliveryOptionId = deliveryOptionId;
    } else {
      return;
    }

    this.saveToLocalStorage();
  }
  cleanCart() {
    this.cartItems = [];

    renderOrderSummary();
    this.saveToLocalStorage();
  }
}

export let cart = new Cart("cart");
