import renderOrderSummary from "./checkout/orderSummary.js";
import renderPaymentSummary from "./checkout/paymentSummary.js";
import renderCheckoutHeader from "./checkout/checkoutHeader.js";
import { loadCart } from "./data/cart.js";
import { loadProductsFetch } from "./data/products.js";
// import "./data/backend-practice.js";
// import "./data/car.js"
// import "./data/cart-oop.js";

renderCheckoutHeader();
renderOrderSummary();
renderPaymentSummary();

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      new Promise((resolve, reject) => {
        loadCart(() => {
          resolve("value3");
        });
      }),
    ]);
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
