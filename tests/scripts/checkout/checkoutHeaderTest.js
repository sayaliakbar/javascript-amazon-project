import renderCheckoutHeader from "../../../scripts/checkout/checkoutHeader.js";
import { cart } from "../../../scripts/data/cart.js";

describe("Checkout header functionality", () => {
  describe("renderCheckoutHeader", () => {
    beforeEach(() => {
      spyOn(localStorage, "setItem");

      // Setup DOM structure needed for the test
      document.querySelector(".js-test-checkout-container").innerHTML = `
        <div class="js-checkout-header-middle-section"></div>
      `;
    });

    afterEach(() => {
      // Clean up the DOM after each test
      document.querySelector(".js-test-checkout-container").innerHTML = "";
    });

    it("displays the correct number of items in the header", () => {
      // Setup cart with multiple items
      cart.cartItems = [
        {
          productId: "123",
          quantity: 2,
        },
        {
          productId: "456",
          quantity: 3,
        },
      ];

      renderCheckoutHeader();

      // Get the updated HTML
      const headerHTML = document.querySelector(
        ".js-checkout-header-middle-section"
      ).innerHTML;

      // Check that it contains the correct item count (2 + 3 = 5)
      expect(headerHTML).toContain("5 items");
    });

    it("includes a link back to the homepage", () => {
      // Setup cart with some items
      cart.cartItems = [
        {
          productId: "123",
          quantity: 2,
        },
      ];

      renderCheckoutHeader();

      const link = document.querySelector(".return-to-home-link");

      expect(link).not.toBeNull();
      expect(link.getAttribute("href")).toBe("amazon.html");
    });

    it("updates the cart quantity in the header correctly", () => {
      // First setup with 2 items
      cart.cartItems = [
        {
          productId: "123",
          quantity: 2,
        },
      ];

      renderCheckoutHeader();

      // Check initial state
      let quantityElement = document.querySelector(".js-cart-items-quantity");
      expect(quantityElement.textContent).toBe("2 items");

      // Change cart to 3 items
      cart.cartItems = [
        {
          productId: "123",
          quantity: 3,
        },
      ];

      renderCheckoutHeader();

      // Check updated state
      quantityElement = document.querySelector(".js-cart-items-quantity");
      expect(quantityElement.textContent).toBe("3 items");
    });

    it("handles an empty cart correctly", () => {
      // Setup empty cart
      cart.cartItems = [];

      renderCheckoutHeader();

      const quantityElement = document.querySelector(".js-cart-items-quantity");
      expect(quantityElement.textContent).toBe("0 items");
    });
  });
});
