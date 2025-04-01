import { cart, Cart } from "../../../scripts/data/cart-class.js";
import { deliveryOptions } from "../../../scripts/data/deliveryOptions.js";
// Import Cart class directly for testing new instances

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
      cart.cartItems = [
        {
          productId: product1,
          quantity: 1,
          deliveryOptionId: "1",
        },
      ];

      // Execute the function being tested with a specific product ID
      cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

      // Assertions to verify correct behavior:
      // Verify the cart now contains exactly one item
      expect(cart.cartItems.length).toEqual(1);
      // Verify the updated cart was saved to localStorage
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      // Verify the correct product ID was added to the cart
      expect(cart.cartItems[0].productId).toEqual(
        "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
      );
      // Verify the product was added with quantity of 1
      expect(cart.cartItems[0].quantity).toEqual(2);

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
      cart.cartItems = [];

      // Initialize the cart from our mocked empty storage

      // Execute the function being tested with a specific product ID
      cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

      // Assertions to verify correct behavior:
      // Verify the cart now contains exactly one item
      expect(cart.cartItems.length).toEqual(1);
      // Verify the updated cart was saved to localStorage
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      // Verify the correct product ID was added to the cart
      expect(cart.cartItems[0].productId).toEqual(
        "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
      );
      // Verify the product was added with quantity of 1
      expect(cart.cartItems[0].quantity).toEqual(1);
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

      cart.cartItems = [
        {
          productId: product1,
          quantity: 1,
          deliveryOptionId: "1",
        },
      ];
    });

    it("removes a product from the cart", () => {
      cart.removeFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

      expect(cart.cartItems.length).toEqual(0);

      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify([])
      );
    });

    it("removes a non existing product from the cart", () => {
      cart.removeFromCart("e43638ce-6aa0-4b85-b27f-abcdefghijkl");

      expect(cart.cartItems.length).toEqual(1);
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

      cart.cartItems = [
        {
          productId: product1,
          quantity: 1,
          deliveryOptionId: "1",
        },
      ];
    });

    it("update the delivery option of a product in the cart", () => {
      cart.updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", "3");

      expect(cart.cartItems.length).toEqual(1);
      expect(cart.cartItems[0].deliveryOptionId).toEqual("3");
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
      cart.updateDeliveryOption("e43638ce-6aa0-4b85-b27f-abcdefghij", "3");

      expect(cart.cartItems.length).toEqual(1);
      expect(cart.cartItems[0].deliveryOptionId).toEqual("1");
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("edge case test: use a deliveryOptionId that does not exist", () => {
      cart.updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", "4");

      expect(cart.cartItems.length).toEqual(1);
      expect(cart.cartItems[0].deliveryOptionId).toEqual("1");
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });

  describe("calculateCartQuantity", () => {
    beforeEach(() => {
      spyOn(localStorage, "setItem");
    });
    it("correctly calculates total quantity of items in cart", () => {
      cart.cartItems = [
        {
          productId: "product1",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "product2",
          quantity: 3,
          deliveryOptionId: "1",
        },
      ];

      expect(cart.calculateCartQuantity()).toEqual(5);
    });

    it("returns 0 for empty cart", () => {
      cart.cartItems = [];

      expect(cart.calculateCartQuantity()).toEqual(0);
    });
  });

  describe("updateQuantity", () => {
    let originalBody;

    beforeEach(() => {
      // Store original body content
      originalBody = document.body.innerHTML;

      spyOn(localStorage, "setItem");
      // Mock renderCheckoutHeader to prevent DOM manipulation
      spyOn(cart, "updateCartQuantity");
      spyOn(cart, "removeFromCart").and.callThrough();

      cart.cartItems = [
        {
          productId: product1,
          quantity: 2,
          deliveryOptionId: "1",
        },
      ];

      // Create mock DOM elements
      document.body.innerHTML = `
        <div class="js-cart-item-container-${product1}"></div>
        <span class="js-quantity-label-${product1}">2</span>
        <input class="js-quantity-input-${product1}" value="">
      `;
    });

    afterEach(() => {
      // Restore original DOM after tests
      document.body.innerHTML = originalBody;
    });

    it("updates quantity for valid input", () => {
      // Mock DOM elements
      const mockLabel = document.querySelector(
        `.js-quantity-label-${product1}`
      );
      const mockContainer = document.querySelector(
        `.js-cart-item-container-${product1}`
      );

      cart.updateQuantity(product1, 5);

      expect(cart.cartItems[0].quantity).toEqual(5);
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(cart.updateCartQuantity).toHaveBeenCalled();
      expect(mockLabel.innerText).toEqual("5");
      expect(
        mockContainer.classList.contains("is-editing-quantity")
      ).toBeFalse();
    });

    it("removes product when quantity is set to 0", () => {
      cart.updateQuantity(product1, 0);

      expect(cart.removeFromCart).toHaveBeenCalledWith(product1);
      expect(cart.updateCartQuantity).toHaveBeenCalled();
    });

    it("doesn't update quantity for invalid inputs (negative)", () => {
      const mockInput = document.querySelector(
        `.js-quantity-input-${product1}`
      );

      cart.updateQuantity(product1, -1);

      expect(cart.cartItems[0].quantity).toEqual(2);
      expect(mockInput.classList.contains("quantity-input-error")).toBeTrue();
    });

    it("doesn't update quantity for invalid inputs (≥1000)", () => {
      const mockInput = document.querySelector(
        `.js-quantity-input-${product1}`
      );

      cart.updateQuantity(product1, 1000);

      expect(cart.cartItems[0].quantity).toEqual(2);
      expect(mockInput.classList.contains("quantity-input-error")).toBeTrue();
    });
  });

  describe("Cart initialization", () => {
    let originalGetItem;

    beforeEach(() => {
      // Store original method
      originalGetItem = localStorage.getItem;

      // Mock methods
      spyOn(localStorage, "setItem");
    });

    afterEach(() => {
      // Restore original method
      localStorage.getItem = originalGetItem;
    });

    it("initializes with default items when localStorage is empty", () => {
      // Setup mock
      spyOn(localStorage, "getItem").and.returnValue(null);

      // Create new cart instance to trigger initialization
      const testCart = new Cart("test-cart");

      expect(testCart.cartItems.length).toEqual(2);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("loads cart items from localStorage when available", () => {
      const storedCart = [
        {
          productId: "test-product",
          quantity: 3,
          deliveryOptionId: "2",
        },
      ];

      spyOn(localStorage, "getItem").and.returnValue(
        JSON.stringify(storedCart)
      );

      // Create new cart instance to trigger initialization
      const testCart = new Cart("test-cart");

      expect(testCart.cartItems).toEqual(storedCart);
      expect(testCart.cartItems.length).toEqual(1);
    });
  });

  describe("updateCartQuantity", () => {
    let originalBody;

    beforeEach(() => {
      spyOn(localStorage, "setItem");

      originalBody = document.body.innerHTML;
      document.body.innerHTML = '<span class="js-cart-quantity"></span>';
    });

    afterEach(() => {
      document.body.innerHTML = originalBody;
    });

    it("displays cart quantity when not empty", () => {
      cart.cartItems = [
        { productId: "p1", quantity: 3, deliveryOptionId: "1" },
        { productId: "p2", quantity: 2, deliveryOptionId: "2" },
      ];

      cart.updateCartQuantity();

      const quantityElement = document.querySelector(".js-cart-quantity");
      expect(quantityElement.innerText).toEqual("5");
    });

    it("displays empty string when cart is empty", () => {
      cart.cartItems = [];

      cart.updateCartQuantity();

      const quantityElement = document.querySelector(".js-cart-quantity");
      expect(quantityElement.innerText).toEqual("");
    });
  });

  describe("delivery options validation", () => {
    beforeEach(() => {
      spyOn(localStorage, "setItem");

      // Mock the deliveryOptions
      spyOn(deliveryOptions, "forEach").and.callFake((callback) => {
        [
          { id: "1", deliveryDays: 7, priceCents: 0 },
          { id: "2", deliveryDays: 3, priceCents: 499 },
          { id: "3", deliveryDays: 1, priceCents: 999 },
        ].forEach(callback);
      });
    });

    it("validates delivery option exists", () => {
      cart.cartItems = [
        { productId: product1, quantity: 1, deliveryOptionId: "1" },
      ];

      cart.updateDeliveryOption(product1, "2");
      expect(cart.cartItems[0].deliveryOptionId).toEqual("2");

      cart.updateDeliveryOption(product1, "invalid");
      // Should stay the same since invalid option
      expect(cart.cartItems[0].deliveryOptionId).toEqual("2");
    });
  });
});
