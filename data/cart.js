export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 4,
    },
  ];
}

function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

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

  saveToLocalStorage();
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

  saveToLocalStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  const checkoutCartQuantity = document.querySelector(
    ".js-cart-items-quantity"
  );

  const amazonCartQuantity = document.querySelector(".js-cart-quantity");

  if (checkoutCartQuantity) {
    checkoutCartQuantity.innerText = cartQuantity
      ? `${cartQuantity} items`
      : "";
  }

  if (amazonCartQuantity) {
    amazonCartQuantity.innerText = cartQuantity ? cartQuantity : "";
  }
}

export function updateQuantity(productId, newQuantity) {
  if (newQuantity >= 0 && newQuantity < 1000) {
    if (newQuantity === 0) {
      removeFromCart(productId);
      updateCartQuantity();
      return;
    }

    document.querySelector(`.js-quantity-label-${productId}`).innerText =
      newQuantity;

    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = newQuantity;
      }
    });

    document
      .querySelector(`.js-cart-item-container-${productId}`)
      .classList.remove("is-editing-quantity");
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartQuantity();

    document
      .querySelector(`.js-quantity-input-${productId}`)
      .classList.remove("quantity-input-error");
  } else {
    document
      .querySelector(`.js-quantity-input-${productId}`)
      .classList.add("quantity-input-error");
  }
}
