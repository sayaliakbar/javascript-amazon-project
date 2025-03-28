export let cart = [];

export function addToCart(productId, addedToCartVar) {
  let matchingcartItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingcartItem = cartItem;
    }
  });
  if (matchingcartItem) {
    matchingcartItem.quantity += Number(
      document.querySelector(
        `.js-quantity-selector-${matchingcartItem.productId}`
      ).value
    );
  } else {
    cart.push({
      productId,
      quantity: Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
      ),
    });
  }
  document
    .querySelector(`.js-added-to-cart-${productId}`)
    .classList.add("added-to-cart-visible");

  clearTimeout(addedToCartVar);
  addedToCartVar = setTimeout(() => {
    document
      .querySelector(`.js-added-to-cart-${productId}`)
      .classList.remove("added-to-cart-visible");
  }, 2000);
}
