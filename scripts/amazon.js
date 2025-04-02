import { cart } from "./data/cart.js";
import { products } from "./data/products.js";

import "./navbar.js";

// Keep track of which products to display
let displayedProducts = products;

// Function to render products on the page
function renderProducts() {
  let productList = "";

  displayedProducts.forEach((product) => {
    productList += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src=${product.getStarsUrl()}>
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
            ${product.extraInfoHTML()}
            
          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">
            Add to Cart
          </button>
        </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productList;

  // Re-attach event listeners after DOM update
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    let addedToCartVar;

    button.addEventListener("click", () => {
      const { productId } = button.dataset;

      cart.addToCart(productId);

      clearTimeout(addedToCartVar);

      addedToCartVar = setTimeout(() => {
        document
          .querySelector(`.js-added-to-cart-${productId}`)
          .classList.remove("added-to-cart-visible");
      }, 2000);

      cart.updateCartQuantity();
    });
  });
}

// Check for search parameter in URL when page loads
function checkForSearchParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search");

  if (searchTerm) {
    // Update the search input field with the search term
    document.querySelector(".js-search-bar").value = searchTerm;

    // Filter the products based on the search term
    displayedProducts = products.filter((product) => {
      // Check if product name contains the search term
      if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }

      // Check if any keyword contains the search term
      if (
        product.keywords &&
        product.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return true;
      }

      return false;
    });

    // Render the filtered products
    renderProducts();
  } else {
    // No search term, show all products
    displayedProducts = products;
    renderProducts();
  }
}

// Initial page load
checkForSearchParameter();

// Handle the search button click on the current page
document.querySelector(".js-search-button").addEventListener("click", () => {
  const searchProduct = document
    .querySelector(".js-search-bar")
    .value.toLowerCase();

  displayedProducts = products.filter((product) => {
    // Check if product name contains the search term
    if (product.name.toLowerCase().includes(searchProduct)) {
      return true;
    }

    // Check if any keyword contains the search term
    if (
      product.keywords &&
      product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchProduct)
      )
    ) {
      return true;
    }

    return false;
  });

  // Render the filtered products
  renderProducts();

  // Update the URL with the search parameter (without page refresh)
  const url = new URL(window.location);
  url.searchParams.set("search", searchProduct);
  window.history.pushState({}, "", url);
});

cart.updateCartQuantity();
