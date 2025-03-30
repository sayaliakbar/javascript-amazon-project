import {
  addToCart,
  loadFromStorage,
  cart,
  removeFromCart,
  updateDeliveryOption,
} from "../../../scripts/data/cart.js";

/**
 * Test suite for the cart functionality
 */
describe("Cart functionality", () => {
  /**
   * Tests the addToCart function behavior
   */
  const product1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  describe("addToCart", () => {
    beforeEach(() => {
      // Mock localStorage.setItem to track calls without actually setting values
      spyOn(localStorage, "setItem");
    });

    it("adds an existing product to the cart", () => {
      // Mock localStorage.getItem to simulate cart with 1 product in storage
      spyOn(localStorage, "getItem").and.callFake(() => {
        return JSON.stringify([
          {
            productId: product1,
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

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([
          {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: "1",
          },
        ])
      );
    });

    it("adds a new product to the cart", () => {
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
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([
          {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: "1",
          },
        ])
      );
    });
  });

  describe("removeFromCart", () => {
    beforeEach(() => {
      spyOn(localStorage, "setItem");

      spyOn(localStorage, "getItem").and.callFake(() => {
        return JSON.stringify([
          {
            productId: product1,
            quantity: 1,
            deliveryOptionId: "1",
          },
        ]);
      });

      loadFromStorage();
    });

    it("removes a product from the cart", () => {
      removeFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

      expect(cart.length).toEqual(0);

      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([])
      );
    });

    it("removes a non existing product from the cart", () => {
      removeFromCart("e43638ce-6aa0-4b85-b27f-abcdefghijkl");

      expect(cart.length).toEqual(1);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([
          {
            productId: product1,
            quantity: 1,
            deliveryOptionId: "1",
          },
        ])
      );
    });
  });

  describe("updateDeliveryOption", () => {
    beforeEach(() => {
      spyOn(localStorage, "setItem");

      spyOn(localStorage, "getItem").and.callFake(() => {
        return JSON.stringify([
          {
            productId: product1,
            quantity: 1,
            deliveryOptionId: "1",
          },
        ]);
      });

      loadFromStorage();
    });

    it("update the delivery option of a product in the cart", () => {
      updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", "3");

      expect(cart.length).toEqual(1);
      expect(cart[0].deliveryOptionId).toEqual("3");
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([
          {
            productId: product1,
            quantity: 1,
            deliveryOptionId: "3",
          },
        ])
      );
    });

    it("edge case test: update the deliveryOptionId of a product that is not in the cart", () => {
      updateDeliveryOption("e43638ce-6aa0-4b85-b27f-abcdefghij", "3");

      expect(cart.length).toEqual(1);
      expect(cart[0].deliveryOptionId).toEqual("1");
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("edge case test: use a deliveryOptionId that does not exist", () => {
      updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", "4");

      expect(cart.length).toEqual(1);
      expect(cart[0].deliveryOptionId).toEqual("1");
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });
});
