export let cart = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 4,
  },
];

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

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (productId !== cartItem.productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  document.querySelector(`.js-cart-item-container-${productId}`).remove();
}
