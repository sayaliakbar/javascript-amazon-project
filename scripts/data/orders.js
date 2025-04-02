import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export class Orders {
  orderItems;
  #localStorageKey;

  constructor(localStorageKey = "orders") {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  /**
   * Loads order data from localStorage.
   * Handles empty or invalid data gracefully by defaulting to an empty array.
   */
  loadFromStorage() {
    try {
      const storageData = localStorage.getItem(this.#localStorageKey);

      // Handle null or undefined values from localStorage
      if (!storageData) {
        this.orderItems = [];
        return;
      }

      // Try to parse JSON
      this.orderItems = JSON.parse(storageData);

      // Check if we got a valid array, fallback to empty array if not
      if (!Array.isArray(this.orderItems)) {
        this.orderItems = [];
      }
    } catch (error) {
      console.error("Error loading orders from storage:", error);
      // Default to empty array on error
      this.orderItems = [];
    }
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

  /**
   * Gets a dayjs object representing the order date
   * @param {string} orderId - ID of the order to get date for
   * @returns {object} dayjs object or null if order not found
   */
  getOrderDate(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    return dayjs(order.orderDate);
  }

  /**
   * Gets a formatted date string for an order
   * @param {string} orderId - ID of the order to format date for
   * @returns {string} Formatted date or empty string if order not found
   */
  getFormattedOrderDate(orderId) {
    // This should call getOrderDate internally
    const dateObj = this.getOrderDate(orderId);
    if (!dateObj) return "";

    // Format the date using the formatDate method
    return this.formatDate(dateObj.toDate());
  }
}

export const orders = new Orders();
