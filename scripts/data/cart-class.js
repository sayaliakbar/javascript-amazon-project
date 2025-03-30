import renderCheckoutHeader from "../checkout/checkoutHeader.js";
import renderOrderSummary from "../checkout/orderSummary.js";
import { deliveryOptions } from "./deliveryOptions.js";

class Cart {
  cartItems;
  localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 4,
          deliveryOptionId: "2",
        },
      ];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
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
    if (newQuantity >= 0 && newQuantity < 1000) {
      if (newQuantity === 0) {
        this.removeFromCart(productId);
        this.updateCartQuantity();
        renderCheckoutHeader();
        return;
      }

      document.querySelector(`.js-quantity-label-${productId}`).innerText =
        newQuantity;

      this.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.quantity = newQuantity;
        }
      });

      document
        .querySelector(`.js-cart-item-container-${productId}`)
        .classList.remove("is-editing-quantity");
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.cartItems)
      );
      this.updateCartQuantity();

      document
        .querySelector(`.js-quantity-input-${productId}`)
        .classList.remove("quantity-input-error");
    } else {
      document
        .querySelector(`.js-quantity-input-${productId}`)
        .classList.add("quantity-input-error");
    }

    document.querySelector(`.js-quantity-input-${productId}`).value = "";
    renderCheckoutHeader();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingcartItem;
    let isOptionId = false;

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingcartItem = cartItem;
      }
    });

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        isOptionId = true;
      }
    });

    if (matchingcartItem && isOptionId) {
      matchingcartItem.deliveryOptionId = deliveryOptionId;
    } else {
      return;
    }

    this.saveToLocalStorage();
  }
}

let cart = new Cart("cart-oop");

let businessCart = new Cart("cart-business");

console.log(cart);

console.log(businessCart);
