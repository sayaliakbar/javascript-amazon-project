import { orders, Orders } from "../../../scripts/data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

describe("Orders class", () => {
  // Sample order data for testing
  const sampleOrders = [
    {
      orderId: "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
      orderDate: "2023-08-12T00:00:00.000Z",
      orderPriceCents: 3506,
      orderItem: [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "2",
        },
        {
          productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
          quantity: 2,
          deliveryOptionId: "7",
        },
      ],
    },
    {
      orderId: "b6b6c212-d30e-4d4a-805d-90b52ce6b37d",
      orderDate: "2023-06-10T00:00:00.000Z",
      orderPriceCents: 4190,
      orderItem: [
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 2,
          deliveryOptionId: "7",
        },
      ],
    },
  ];

  let testOrders;

  beforeEach(() => {
    // Setup mock localStorage BEFORE creating test instances
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.returnValue(JSON.stringify([]));

    // Reset the main orders object to a known state
    orders.orderItems = [...sampleOrders];

    // Create a fresh test instance for each test
    testOrders = new Orders("test-orders");
    testOrders.orderItems = [];

    // Clear spy counts
    localStorage.setItem.calls.reset();
    localStorage.getItem.calls.reset();
  });

  afterEach(() => {
    // Clean up any additional test data or state
  });

  // Group 1: Initialization and Constructor Tests
  describe("Initialization", () => {
    it("initializes with the provided local storage key", () => {
      // Need to mock localStorage.getItem before creating a new instance
      localStorage.getItem.and.returnValue(JSON.stringify([]));

      const customKey = "test-orders-storage";
      const customOrders = new Orders(customKey);
      customOrders.saveToLocalStorage();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        customKey,
        jasmine.any(String)
      );
    });

    it("initializes with the default local storage key if none provided", () => {
      // Need to mock localStorage.getItem before creating a new instance
      localStorage.getItem.and.returnValue(JSON.stringify([]));

      const defaultKey = "orders";
      const defaultOrders = new Orders();
      defaultOrders.saveToLocalStorage();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        defaultKey,
        jasmine.any(String)
      );
    });

    it("should start with an empty orderItems array when first created", () => {
      // Need to mock localStorage.getItem before creating a new instance
      localStorage.getItem.and.returnValue(JSON.stringify([]));

      const freshOrders = new Orders("fresh");
      expect(freshOrders.orderItems).toEqual([]);
    });
  });

  // Group 2: Storage Operations Tests
  describe("Storage Operations", () => {
    describe("loadFromStorage", () => {
      it("loads existing orders from localStorage", () => {
        const mockOrderData = JSON.stringify(sampleOrders);
        localStorage.getItem.and.returnValue(mockOrderData);

        // Create new instance after mocking
        const newOrders = new Orders("test-orders");

        expect(localStorage.getItem).toHaveBeenCalledWith("test-orders");
        expect(newOrders.orderItems.length).toBe(2);
        expect(newOrders.orderItems[0].orderId).toBe(
          "27cba69d-4c3d-4098-b42d-ac7fa62b7664"
        );
      });

      it("initializes with empty array when localStorage is empty", () => {
        // Mock null return from localStorage
        localStorage.getItem.and.returnValue(null);

        // Create a completely fresh instance without any preset orderItems
        const emptyOrders = new Orders("empty-test-orders");

        // Clear any internal state by assigning a new orderItems array
        emptyOrders.orderItems = [];

        // When we explicitly call loadFromStorage with a null localStorage value
        emptyOrders.loadFromStorage();

        // The result should be an empty array
        expect(emptyOrders.orderItems).toEqual([]);
      });

      it("handles invalid JSON data gracefully", () => {
        // Setup invalid JSON
        localStorage.getItem.and.returnValue("invalid-json-data");

        // Create a new instance for this test
        const errorOrders = new Orders("error-test-orders");

        // Reset orderItems to a known state
        errorOrders.orderItems = [];

        // The test should not throw when we explicitly call loadFromStorage
        expect(() => {
          errorOrders.loadFromStorage();
        }).not.toThrow();

        // And orderItems should be an empty array as fallback
        expect(errorOrders.orderItems).toEqual([]);
      });
    });

    describe("saveToLocalStorage", () => {
      it("saves orders to localStorage with the correct key", () => {
        testOrders.orderItems = sampleOrders;
        testOrders.saveToLocalStorage();

        expect(localStorage.setItem).toHaveBeenCalledWith(
          "test-orders",
          JSON.stringify(sampleOrders)
        );
      });

      it("saves empty array when no orders exist", () => {
        testOrders.orderItems = [];
        testOrders.saveToLocalStorage();

        expect(localStorage.setItem).toHaveBeenCalledWith("test-orders", "[]");
      });
    });
  });

  // Group 3: Order Creation and Management Tests
  describe("Order Management", () => {
    describe("createOrderFromCart", () => {
      it("creates a new order with the correct structure", () => {
        const cart = {
          cartItems: [
            {
              productId: "test-product-1",
              quantity: 2,
              deliveryOptionId: "3",
            },
          ],
        };
        const orderPriceCents = 2500;

        spyOn(testOrders, "generateUniqueId").and.returnValue("test-uuid");
        spyOn(testOrders, "saveToLocalStorage");

        const orderId = testOrders.createOrderFromCart(cart, orderPriceCents);
        const createdOrder = testOrders.getOrderById(orderId);

        expect(createdOrder).toBeDefined();
        expect(createdOrder.orderId).toBe("test-uuid");
        expect(createdOrder.orderPriceCents).toBe(orderPriceCents);
        expect(createdOrder.orderItem).toEqual(cart.cartItems);
        expect(createdOrder.orderDate).toBeDefined();
      });

      it("adds the new order to the orderItems array", () => {
        const cart = {
          cartItems: [
            { productId: "test-product-1", quantity: 1, deliveryOptionId: "1" },
          ],
        };

        testOrders.createOrderFromCart(cart, 1000);

        expect(testOrders.orderItems.length).toBe(1);
      });

      it("saves to localStorage after creating an order", () => {
        const cart = {
          cartItems: [
            { productId: "test-product", quantity: 1, deliveryOptionId: "1" },
          ],
        };

        spyOn(testOrders, "saveToLocalStorage");
        testOrders.createOrderFromCart(cart, 1500);

        expect(testOrders.saveToLocalStorage).toHaveBeenCalled();
      });

      it("returns the new order ID", () => {
        const cart = {
          cartItems: [
            { productId: "test", quantity: 1, deliveryOptionId: "1" },
          ],
        };

        const mockId = "mock-uuid-1234";
        spyOn(testOrders, "generateUniqueId").and.returnValue(mockId);

        const result = testOrders.createOrderFromCart(cart, 1000);

        expect(result).toBe(mockId);
      });

      it("handles empty cart gracefully", () => {
        const emptyCart = { cartItems: [] };

        const orderId = testOrders.createOrderFromCart(emptyCart, 0);
        const createdOrder = testOrders.getOrderById(orderId);

        expect(createdOrder.orderItem).toEqual([]);
        expect(createdOrder.orderPriceCents).toBe(0);
      });

      it("uses current date for new orders", () => {
        const cart = {
          cartItems: [
            { productId: "test", quantity: 1, deliveryOptionId: "1" },
          ],
        };

        // Create a spy on Date constructor to return a specific date
        const fixedDate = new Date(2023, 9, 15); // October 15, 2023
        jasmine.clock().mockDate(fixedDate);

        const orderId = testOrders.createOrderFromCart(cart, 1000);
        const createdOrder = testOrders.getOrderById(orderId);

        // Should use the current date (our fixed date)
        expect(new Date(createdOrder.orderDate).getDate()).toBe(15);
        expect(new Date(createdOrder.orderDate).getMonth()).toBe(9); // October
        expect(new Date(createdOrder.orderDate).getFullYear()).toBe(2023);

        jasmine.clock().uninstall();
      });
    });

    describe("getOrderById", () => {
      beforeEach(() => {
        testOrders.orderItems = [...sampleOrders];
      });

      it("returns the correct order when ID exists", () => {
        const existingId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
        const order = testOrders.getOrderById(existingId);

        expect(order).toBeDefined();
        expect(order.orderId).toBe(existingId);
        expect(order.orderPriceCents).toBe(3506);
      });

      it("returns undefined when ID doesn't exist", () => {
        const nonExistentId = "non-existent-id";
        const order = testOrders.getOrderById(nonExistentId);

        expect(order).toBeUndefined();
      });

      it("returns undefined when passed a null or undefined ID", () => {
        expect(testOrders.getOrderById(null)).toBeUndefined();
        expect(testOrders.getOrderById(undefined)).toBeUndefined();
      });
    });
  });

  // Group 4: Utility Method Tests
  describe("Utility Methods", () => {
    describe("generateUniqueId", () => {
      it("generates a properly formatted UUID", () => {
        const uuid = testOrders.generateUniqueId();
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        expect(uuidRegex.test(uuid)).toBe(true);
      });

      it("generates different IDs for each call", () => {
        const uuid1 = testOrders.generateUniqueId();
        const uuid2 = testOrders.generateUniqueId();

        expect(uuid1).not.toBe(uuid2);
      });
    });

    describe("Date Handling", () => {
      beforeEach(() => {
        testOrders.orderItems = [...sampleOrders];
      });

      describe("formatDate", () => {
        it("formats dates in the expected 'Month Day' format", () => {
          const date = new Date(2023, 0, 15); // January 15, 2023
          const formattedDate = testOrders.formatDate(date);

          expect(formattedDate).toBe("January 15");
        });

        it("handles different months correctly", () => {
          expect(testOrders.formatDate(new Date(2023, 0, 1))).toBe("January 1");
          expect(testOrders.formatDate(new Date(2023, 5, 15))).toBe("June 15");
          expect(testOrders.formatDate(new Date(2023, 11, 25))).toBe(
            "December 25"
          );
        });

        it("handles dates without leading zeros", () => {
          expect(testOrders.formatDate(new Date(2023, 7, 5))).toBe("August 5");
          expect(testOrders.formatDate(new Date(2023, 7, 15))).toBe(
            "August 15"
          );
        });
      });

      describe("getOrderDate", () => {
        it("returns a dayjs object for a valid order ID", () => {
          const validId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
          const dateObj = testOrders.getOrderDate(validId);

          expect(dateObj).toBeDefined();
          expect(dayjs.isDayjs(dateObj)).toBe(true);
          expect(dateObj.format("YYYY-MM-DD")).toBe("2023-08-12");
        });

        it("returns null for an invalid order ID", () => {
          const invalidId = "invalid-order-id";
          const dateObj = testOrders.getOrderDate(invalidId);

          expect(dateObj).toBeNull();
        });
      });

      describe("getFormattedOrderDate", () => {
        it("returns a properly formatted date string for a valid order ID", () => {
          const validId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
          spyOn(testOrders, "formatDate").and.returnValue("August 12");

          const formattedDate = testOrders.getFormattedOrderDate(validId);

          expect(formattedDate).toBe("August 12");
          expect(testOrders.formatDate).toHaveBeenCalled();
        });

        it("returns an empty string for an invalid order ID", () => {
          const invalidId = "invalid-order-id";
          const formattedDate = testOrders.getFormattedOrderDate(invalidId);

          expect(formattedDate).toBe("");
        });

        it("integrates with getOrderDate correctly", () => {
          const validId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";

          // Don't use callThrough here - we need a simpler spy that returns a mock date
          const mockDayjs = dayjs("2023-08-12T00:00:00.000Z");
          spyOn(testOrders, "getOrderDate").and.returnValue(mockDayjs);

          // Call the method and verify it returns what we expect based on our mock
          const result = testOrders.getFormattedOrderDate(validId);

          // Verify the spy was called with correct parameters
          expect(testOrders.getOrderDate).toHaveBeenCalledWith(validId);
        });
      });
    });
  });
});
