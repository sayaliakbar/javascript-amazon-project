import {
  addToCart,
  loadFromStorage,
  cart,
} from "../../../scripts/data/cart.js";

/**
 * Test suite for the cart functionality
 * Tests the addToCart function behavior
 */
describe("test suite: addToCart", () => {
  it("adds an existing product to the cart", () => {
    // Mock localStorage.setItem to track calls without actually setting values
    spyOn(localStorage, "setItem");

    // Mock localStorage.getItem to simulate an empty cart in storage
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });

    // Initialize the cart from our mocked empty storage
    loadFromStorage();

    // Execute the function being tested with a specific product ID
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    // Assertions to verify correct behavior:
    // Verify the cart now contains exactly one item
    expect(cart.length).toEqual(1);
    // Verify the updated cart was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    // Verify the correct product ID was added to the cart
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    // Verify the product was added with quantity of 1
    expect(cart[0].quantity).toEqual(2);
  });

  it("adds a new product to the cart", () => {
    // Mock localStorage.setItem to track calls without actually setting values
    spyOn(localStorage, "setItem");

    // Mock localStorage.getItem to simulate an empty cart in storage
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    });

    // Initialize the cart from our mocked empty storage
    loadFromStorage();

    // Execute the function being tested with a specific product ID
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    // Assertions to verify correct behavior:
    // Verify the cart now contains exactly one item
    expect(cart.length).toEqual(1);
    // Verify the updated cart was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    // Verify the correct product ID was added to the cart
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    // Verify the product was added with quantity of 1
    expect(cart[0].quantity).toEqual(1);
  });
});
