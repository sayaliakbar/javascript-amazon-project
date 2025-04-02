let navbar = `<div class="amazon-header-left-section">
      <a href="./index.html" class="header-link">
        <img class="amazon-logo" src="./images/amazon-logo-white.png">
        <img class="amazon-mobile-logo" src="./images/amazon-mobile-logo-white.png">
      </a>
    </div>
    
    <div class="amazon-header-middle-section">
      <input class="search-bar js-search-bar" type="text" placeholder="Search">
    
      <button class="search-button js-search-button">
        <img class="search-icon" src="./images/icons/search-icon.png">
      </button>
    </div>
    
    <div class="amazon-header-right-section">
      <a class="orders-link header-link" href="./orders.html">
        <span class="returns-text">Returns</span>
        <span class="orders-text">& Orders</span>
      </a>
    
      <a class="cart-link header-link" href="./checkout.html">
        <img class="cart-icon" src="./images/icons/cart-icon.png">
        <div class="cart-quantity js-cart-quantity">0</div>
        <div class="cart-text">Cart</div>
      </a>
    </div>`;

document.querySelector(".js-amazon-header").innerHTML = navbar;

// Search functionality that works across all pages
function handleSearch() {
  const searchTerm = document.querySelector(".js-search-bar").value.trim();
  if (searchTerm) {
    // Redirect to index.html with the search term as a URL parameter
    window.location.href = `./index.html?search=${encodeURIComponent(
      searchTerm
    )}`;
  }
}

// Wait for DOM to be fully loaded to attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add click event listener to the search button
  const searchButton = document.querySelector(".js-search-button");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  // Add keypress event listener to the search input (for Enter key)
  const searchInput = document.querySelector(".js-search-bar");
  if (searchInput) {
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });
  }
});
