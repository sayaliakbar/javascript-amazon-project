import renderPaymentSummary from "../../../scripts/checkout/paymentSummary.js";
import { cart } from "../../../scripts/data/cart.js";
import { getProduct } from "../../../scripts/data/products.js";
import { getDeliveryOption } from "../../../scripts/data/deliveryOptions.js";
import { formatCurrency } from "../../../utils/money.js";

const product1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
const product2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

describe("Payment Summary", () => {
  // Helper functions to reduce code duplication
  function calculateProductTotal(cartItems) {
    return cartItems.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + product.priceCents * item.quantity;
    }, 0);
  }

  function calculateShippingTotal(cartItems) {
    return cartItems.reduce((sum, item) => {
      const deliveryOption = getDeliveryOption(item.deliveryOptionId);
      return sum + deliveryOption.priceCents;
    }, 0);
  }

  function calculateTaxAmount(productTotal, shippingTotal) {
    return Math.round((productTotal + shippingTotal) * 0.1);
  }

  function calculateOrderTotal(productTotal, shippingTotal, taxAmount) {
    return productTotal + shippingTotal + taxAmount;
  }

  function getTotalItemCount(cartItems) {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  let productTotal, shippingTotal, taxAmount, orderTotal, itemCount;

  beforeEach(() => {
    spyOn(localStorage, "setItem");

    // Setup DOM structure needed for tests
    document.querySelector(".js-test-checkout-container").innerHTML = `
      <div class="js-payment-summary"></div>
    `;

    // Default cart setup
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

    // Calculate expected values for standard cart
    productTotal = calculateProductTotal(cart.cartItems);
    shippingTotal = calculateShippingTotal(cart.cartItems);
    taxAmount = calculateTaxAmount(productTotal, shippingTotal);
    orderTotal = calculateOrderTotal(productTotal, shippingTotal, taxAmount);
    itemCount = getTotalItemCount(cart.cartItems);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.querySelector(".js-test-checkout-container").innerHTML = "";
  });

  describe("Calculations", () => {
    it("calculates the correct product price total", () => {
      renderPaymentSummary();

      const productTotalElement = document.querySelector(
        ".js-payment-summary-money"
      );
      expect(productTotalElement.innerText).toEqual(
        `$${formatCurrency(productTotal)}`
      );
    });

    it("calculates the correct shipping price", () => {
      renderPaymentSummary();

      const shippingTotalElement = document.querySelector(
        ".js-payment-summary-money-shipping"
      );
      expect(shippingTotalElement.innerText).toEqual(
        `$${formatCurrency(shippingTotal)}`
      );
    });

    it("calculates the correct tax amount", () => {
      renderPaymentSummary();

      const taxElement = document.querySelector(
        ".js-payment-summary-money-tax"
      );
      expect(taxElement.innerText).toEqual(`$${formatCurrency(taxAmount)}`);
    });

    it("calculates the correct order total", () => {
      renderPaymentSummary();

      const orderTotalElement = document.querySelector(
        ".js-payment-summary-money-total"
      );
      expect(orderTotalElement.innerText).toEqual(
        `$${formatCurrency(orderTotal)}`
      );
    });

    it("displays the correct number of items", () => {
      renderPaymentSummary();

      const itemCountElement = document.querySelector(
        ".js-payment-summary-item-count"
      );
      expect(itemCountElement.innerText).toContain(`Items (${itemCount}):`);
    });
  });

  describe("HTML Structure", () => {
    it("renders the correct HTML structure", () => {
      renderPaymentSummary();

      const paymentSummarySection = document.querySelector(
        ".js-payment-summary"
      );

      // Check if heading exists
      const heading = paymentSummarySection.querySelector(
        ".payment-summary-title"
      );
      expect(heading).not.toBeNull();
      expect(heading.textContent.trim()).toBe("Order Summary");

      // Check if all price rows exist
      expect(
        paymentSummarySection.querySelector(".js-payment-summary-item-count")
      ).not.toBeNull();
      expect(
        paymentSummarySection.querySelector(".js-payment-summary-money")
      ).not.toBeNull();
      expect(
        paymentSummarySection.querySelector(
          ".js-payment-summary-money-shipping"
        )
      ).not.toBeNull();
      expect(
        paymentSummarySection.querySelector(".js-payment-summary-money-tax")
      ).not.toBeNull();

      // Check if total row exists and has the correct styling
      const totalRow = paymentSummarySection.querySelector(
        ".js-payment-summary-row-total"
      );
      expect(totalRow).not.toBeNull();
      expect(
        totalRow.querySelector(".js-payment-summary-money-total")
      ).not.toBeNull();

      // Verify the structure has the expected number of rows
      const rows = paymentSummarySection.querySelectorAll(
        ".payment-summary-row"
      );
      expect(rows.length).toBe(5); // Items, Product price, Shipping, Tax, Total
    });
  });

  describe("Edge Cases", () => {
    it("handles multiple items in the cart correctly", () => {
      // Setup cart with additional item
      cart.cartItems = [
        { productId: product1, quantity: 2, deliveryOptionId: "1" },
        { productId: product2, quantity: 4, deliveryOptionId: "2" },
        { productId: product1, quantity: 1, deliveryOptionId: "3" },
      ];

      // Recalculate expected values
      const expectedProductTotal = calculateProductTotal(cart.cartItems);
      const expectedShippingTotal = calculateShippingTotal(cart.cartItems);
      const expectedTax = calculateTaxAmount(
        expectedProductTotal,
        expectedShippingTotal
      );
      const expectedOrderTotal = calculateOrderTotal(
        expectedProductTotal,
        expectedShippingTotal,
        expectedTax
      );
      const expectedItemCount = getTotalItemCount(cart.cartItems);

      renderPaymentSummary();

      // Verify all values
      expect(
        document.querySelector(".js-payment-summary-money").innerText
      ).toEqual(`$${formatCurrency(expectedProductTotal)}`);

      expect(
        document.querySelector(".js-payment-summary-money-shipping").innerText
      ).toEqual(`$${formatCurrency(expectedShippingTotal)}`);

      expect(
        document.querySelector(".js-payment-summary-money-tax").innerText
      ).toEqual(`$${formatCurrency(expectedTax)}`);

      expect(
        document.querySelector(".js-payment-summary-money-total").innerText
      ).toEqual(`$${formatCurrency(expectedOrderTotal)}`);

      expect(
        document.querySelector(".js-payment-summary-item-count").innerText
      ).toContain(`Items (${expectedItemCount}):`);
    });

    it("handles an empty cart", () => {
      // Empty the cart
      cart.cartItems = [];

      renderPaymentSummary();

      // Verify all totals show zero values when cart is empty
      expect(
        document.querySelector(".js-payment-summary-money").innerText
      ).toEqual("$0.00");
      expect(
        document.querySelector(".js-payment-summary-money-shipping").innerText
      ).toEqual("$0.00");
      expect(
        document.querySelector(".js-payment-summary-money-tax").innerText
      ).toEqual("$0.00");
      expect(
        document.querySelector(".js-payment-summary-money-total").innerText
      ).toEqual("$0.00");
      expect(
        document.querySelector(".js-payment-summary-item-count").innerText
      ).toContain("Items (0):");
    });
  });
});
