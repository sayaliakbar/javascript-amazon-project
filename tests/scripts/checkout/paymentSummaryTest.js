import renderPaymentSummary from "../../../scripts/checkout/paymentSummary.js";
import { cart } from "../../../scripts/data/cart-class.js";
import { getProduct } from "../../../scripts/data/products.js";
import { getDeliveryOption } from "../../../scripts/data/deliveryOptions.js";
import { formatCurrency } from "../../../utils/money.js";

const product1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
const product2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

describe("Payment Summary", () => {
  // DOM setup for testing

  beforeEach(() => {
    spyOn(localStorage, "setItem");
  });

  it("calculates the correct product price total", () => {
    // Test logic will go here
    // cart.cartItems = [
    //   {
    //     productId: product1,
    //     quantity: 2,
    //     deliveryOptionId: "1",
    //   },
    //   {
    //     productId: product2,
    //     quantity: 4,
    //     deliveryOptionId: "2",
    //   },
    // ];

    console.log(cart.cartItems);
  });

  it("calculates the correct shipping price", () => {
    // Test logic will go here
  });

  it("calculates the correct tax amount", () => {
    // Test logic will go here
  });

  it("calculates the correct order total", () => {
    // Test logic will go here
  });

  it("displays the correct number of items", () => {
    // Test logic will go here
  });

  it("renders the correct HTML structure", () => {
    // Test logic will go here
  });

  it("handles multiple items in the cart correctly", () => {
    // Test logic will go here
  });

  it("handles an empty cart", () => {
    // Test logic will go here
  });
});
