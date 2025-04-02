import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export class Orders {
  orderItems;
  #localStorageKey;

  constructor(localStorageKey = "orders") {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.orderItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.orderItems) {
      this.orderItems = [
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
    }
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem(
      this.#localStorageKey,
      JSON.stringify(this.orderItems)
    );
  }

  createOrderFromCart(cart, totalPriceCents) {
    // Generate a unique ID
    const orderId = this.generateUniqueId();

    // Get current date in ISO format
    const orderDate = new Date().toISOString();

    const newOrder = {
      orderId,
      orderDate,
      orderPriceCents: totalPriceCents,
      orderItem: [...cart.cartItems],
    };

    this.orderItems.push(newOrder);
    this.saveToLocalStorage();

    return orderId;
  }

  generateUniqueId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  formatDate(date) {
    return dayjs(date).format("MMMM D");
  }

  getOrderById(orderId) {
    return this.orderItems.find((order) => order.orderId === orderId);
  }

  // New method to get dayjs object from stored date
  getOrderDate(orderId) {
    const order = this.getOrderById(orderId);
    if (order) {
      return dayjs(order.orderDate);
    }
    return null;
  }

  // New method to get formatted date for display
  getFormattedOrderDate(orderId) {
    const order = this.getOrderById(orderId);
    if (order) {
      return this.formatDate(order.orderDate);
    }
    return "";
  }
}

export const orders = new Orders("orders");
