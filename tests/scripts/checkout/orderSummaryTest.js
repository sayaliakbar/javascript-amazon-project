import { renderOrderSummary } from "../../../scripts/checkout/orderSummary.js";
import { cart } from "../../../scripts/data/cart-class.js";

const product1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
const product2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

describe("Order summary functionality", () => {
  describe("renderOrderSummary", () => {
    // Helper function to verify product details
    function verifyProductInDOM(
      productId,
      expectedName,
      expectedPrice,
      expectedQuantity
    ) {
      expect(
        document.querySelector(`.js-product-quantity-${productId}`).innerText
      ).toContain(`Quantity: ${expectedQuantity}`);
      expect(
        document.querySelector(`.js-product-name-${productId}`).innerText
      ).toContain(expectedName);
      expect(
        document.querySelector(`.js-product-price-${productId}`).innerText
      ).toContain(expectedPrice);
    }

    beforeEach(() => {
      spyOn(localStorage, "setItem");

      cart.cartItems = [
        {
          productId: product1,
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: product2,
          quantity: 4,
          deliveryOptionId: "2",
        },
      ];

      document.querySelector(".js-test-checkout-container").innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>`;

      renderOrderSummary();
      console.log(document.querySelector(".js-test-checkout-container"));
    });

    afterEach(() => {
      document.querySelector(".js-test-checkout-container").innerHTML = ``;
    });

    it("displays the cart with correct product information", () => {
      console.log(document.querySelectorAll(".js-cart-item-container"));
      expect(
        document.querySelectorAll(".js-cart-item-container").length
      ).toEqual(2);

      verifyProductInDOM(
        product1,
        "Black and Gray Athletic Cotton Socks - 6 Pairs",
        "$10.90",
        "2"
      );

      verifyProductInDOM(
        product2,
        "Intermediate Size Basketball",
        "$20.95",
        "4"
      );
    });

    it("removes a product and updates the cart correctly", () => {
      document.querySelector(`.js-delete-link-${product1}`).click();

      // Verify product removal from DOM
      expect(
        document.querySelectorAll(".js-cart-item-container").length
      ).toEqual(1);
      expect(
        document.querySelector(`.js-cart-item-container-${product1}`)
      ).toEqual(null);
      expect(
        document.querySelector(`.js-cart-item-container-${product2}`)
      ).not.toEqual(null);

      // Verify cart data structure
      expect(cart.cartItems.length).toEqual(1);
      expect(cart.cartItems[0].productId).toEqual(product2);

      // Verify remaining product's information
      verifyProductInDOM(
        product2,
        "Intermediate Size Basketball",
        "$20.95",
        "4"
      );
    });

    it("updates the delivery option dates of a product", () => {
      document.querySelector(`.js-delivery-option-${product1}-3`).click();

      expect(
        document.querySelector(`.js-delivery-option-input-${product1}-3`)
          .checked
      ).toEqual(true);

      expect(cart.cartItems.length).toEqual(2);
      expect(cart.cartItems[0].productId).toEqual(product1);
      expect(cart.cartItems[0].deliveryOptionId).toEqual("3");

      expect(
        document.querySelector(".js-payment-summary-money-shipping").innerText
      ).toContain("$14.98");

      expect(
        document.querySelector(".js-payment-summary-money-total").innerText
      ).toContain("$132.64");
    });
  });
});
