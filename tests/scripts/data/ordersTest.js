import { orders, Orders } from "../../../scripts/data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

describe("Orders class", () => {
  beforeEach(() => {
    // Setup for tests
    spyOn(localStorage, "setItem");
    orders.orderItems = [
      {
        orderId: "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
        orderDate: "2023-08-12T00:00:00.000Z", // Changed to ISO format
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
        orderDate: "2023-06-10T00:00:00.000Z", // Changed to ISO format
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
  });

  afterEach(() => {
    // Cleanup after tests
  });

  describe("Constructor and initialization", () => {
    it("initializes with the provided local storage key", () => {
      // Test initialization with custom key
      const customKey = "test-orders-storage";
      const testOrders = new Orders(customKey);

      // Clear spy count before testing
      localStorage.setItem.calls.reset();

      // Trigger saving to storage which will use the private key
      testOrders.saveToLocalStorage();

      // Verify the correct key was used when saving
      expect(localStorage.setItem).toHaveBeenCalledWith(
        customKey,
        jasmine.any(String)
      );
    });

    it("initializes with the default local storage key if none provided", () => {
      // Test default key initialization
      const defaultKey = "orders";
      const testOrders = new Orders();

      // Clear spy count before testing
      localStorage.setItem.calls.reset();

      // Trigger saving to storage which will use the private key
      testOrders.saveToLocalStorage();

      // Verify the default key was used when saving
      expect(localStorage.setItem).toHaveBeenCalledWith(
        defaultKey,
        jasmine.any(String)
      );
    });
  });

  describe("loadFromStorage", () => {
    it("loads existing orders from localStorage", () => {
      // Test loading existing orders
      // Setup mock localStorage.getItem to return predefined data
      const mockOrderData = JSON.stringify([
        {
          orderId: "test-id-1",
          orderDate: "2023-09-15T00:00:00.000Z",
          orderPriceCents: 2000,
          orderItem: [],
        },
      ]);

      spyOn(localStorage, "getItem").and.returnValue(mockOrderData);

      // Create new instance and load from storage
      const testOrders = new Orders("test-key");
      testOrders.orderItems = []; // Reset to empty first
      testOrders.loadFromStorage();

      // Verify orders were loaded correctly
      expect(testOrders.orderItems.length).toBe(1);
      expect(testOrders.orderItems[0].orderId).toBe("test-id-1");
      expect(testOrders.orderItems[0].orderPriceCents).toBe(2000);
    });

    it("initializes with default orders when localStorage is empty", () => {
      // Mock localStorage to return null (empty)
      spyOn(localStorage, "getItem").and.returnValue(JSON.stringify([]));

      // Create new instance and load from storage
      const testOrders = new Orders("test-key");

      // Call loadFromStorage which should handle the null case
      testOrders.loadFromStorage();

      // Verify the method was called with the right key
      expect(localStorage.getItem).toHaveBeenCalledWith("test-key");

      // Verify default empty array is used when localStorage returns []
      expect(testOrders.orderItems.length).toEqual(0);
    });
  });

  describe("saveToLocalStorage", () => {
    it("saves orders to localStorage with the correct key", () => {
      // Test saving to localStorage
      const testOrders = new Orders("test-key");

      // Clear any previous calls
      localStorage.setItem.calls.reset();

      testOrders.saveToLocalStorage();

      // Verify localStorage.setItem was called with the right parameters
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify(testOrders.orderItems)
      );
    });
  });

  describe("createOrderFromCart", () => {
    it("creates a new order with the correct structure", () => {
      const testOrders = new Orders();
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

      // Get the created order
      const createdOrder = testOrders.getOrderById(orderId);

      // Check structure
      expect(createdOrder).toBeDefined();
      expect(createdOrder.orderId).toBe("test-uuid");
      expect(createdOrder.orderPriceCents).toBe(orderPriceCents);
      expect(createdOrder.orderItem).toEqual(cart.cartItems);
      expect(createdOrder.orderDate).toBeDefined();
    });

    it("adds the new order to the orderItems array", () => {
      const testOrders = new Orders();
      const initialLength = testOrders.orderItems.length;
      const cart = {
        cartItems: [
          { productId: "test-product-1", quantity: 1, deliveryOptionId: "1" },
        ],
      };

      testOrders.createOrderFromCart(cart, 1000);

      expect(testOrders.orderItems.length).toBe(initialLength + 1);
    });

    it("saves to localStorage after creating an order", () => {
      const testOrders = new Orders();
      spyOn(testOrders, "saveToLocalStorage");

      testOrders.createOrderFromCart(
        {
          cartItems: [
            { productId: "test-product", quantity: 1, deliveryOptionId: "1" },
          ],
        },
        1500
      );

      expect(testOrders.saveToLocalStorage).toHaveBeenCalled();
    });

    it("returns the new order ID", () => {
      const testOrders = new Orders();
      const mockId = "mock-uuid-1234";
      spyOn(testOrders, "generateUniqueId").and.returnValue(mockId);

      const result = testOrders.createOrderFromCart(
        {
          cartItems: [
            { productId: "test", quantity: 1, deliveryOptionId: "1" },
          ],
        },
        1000
      );

      expect(result).toBe(mockId);
    });
  });

  describe("generateUniqueId", () => {
    it("generates a properly formatted UUID", () => {
      const testOrders = new Orders();
      const uuid = testOrders.generateUniqueId();

      // UUID format: 8-4-4-4-12 hex digits
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it("generates different IDs for each call", () => {
      const testOrders = new Orders();
      const uuid1 = testOrders.generateUniqueId();
      const uuid2 = testOrders.generateUniqueId();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("formatDate", () => {
    it("formats dates in the expected 'Month Day' format", () => {
      const testOrders = new Orders();
      const date = new Date(2023, 0, 15); // January 15, 2023
      const formattedDate = testOrders.formatDate(date);

      expect(formattedDate).toBe("January 15");
    });
  });

  describe("getOrderById", () => {
    it("returns the correct order when ID exists", () => {
      const existingId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
      const order = orders.getOrderById(existingId);

      expect(order).toBeDefined();
      expect(order.orderId).toBe(existingId);
    });

    it("returns undefined when ID doesn't exist", () => {
      const nonExistentId = "non-existent-id";
      const order = orders.getOrderById(nonExistentId);

      expect(order).toBeUndefined();
    });
  });

  describe("getOrderDate", () => {
    it("returns a dayjs object for a valid order ID", () => {
      const validId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
      const dateObj = orders.getOrderDate(validId);

      expect(dateObj).toBeDefined();
      expect(dayjs.isDayjs(dateObj)).toBe(true);
      expect(dateObj.format("YYYY-MM-DD")).toBe("2023-08-12");
    });

    it("returns null for an invalid order ID", () => {
      const invalidId = "invalid-order-id";
      const dateObj = orders.getOrderDate(invalidId);

      expect(dateObj).toBeNull();
    });
  });

  describe("getFormattedOrderDate", () => {
    it("returns a properly formatted date string for a valid order ID", () => {
      const validId = "27cba69d-4c3d-4098-b42d-ac7fa62b7664";
      spyOn(orders, "formatDate").and.returnValue("August 12");

      const formattedDate = orders.getFormattedOrderDate(validId);

      expect(formattedDate).toBe("August 12");
      expect(orders.formatDate).toHaveBeenCalled();
    });

    it("returns an empty string for an invalid order ID", () => {
      const invalidId = "invalid-order-id";
      const formattedDate = orders.getFormattedOrderDate(invalidId);

      expect(formattedDate).toBe("");
    });
  });
});
