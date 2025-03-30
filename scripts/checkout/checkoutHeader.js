import { cart } from "../data/cart.js";

function renderCheckoutHeader() {
  let cartItems = 0;
  cart.forEach((cartItem) => {
    cartItems += cartItem.quantity;
  });

  const html = `Checkout (<a class="return-to-home-link js-cart-items-quantity" href="amazon.html">${cartItems} items</a>)`;

  const headerItemCountElement = document.querySelector(
    ".js-checkout-header-middle-section"
  );

  if (headerItemCountElement) {
    headerItemCountElement.innerHTML = html;
  }
}

export default renderCheckoutHeader;
