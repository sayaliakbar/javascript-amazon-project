import {
  calculateDeliveryDate,
  getDeliveryOption,
} from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { getProduct } from "../data/products.js";

export function orderItemsHTML(orderProducts) {
  let orderProductsHTML = "";

  orderProducts.orderItem.forEach((orderItem) => {
    const { productId, deliveryOptionId } = orderItem;
    const matchingItem = getProduct(productId);
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const deliveryDate = dayjs(calculateDeliveryDate(deliveryOption));

    orderProductsHTML += `<div class="product-image-container">
            <img src=${matchingItem.image}>
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${deliveryDate.format("MMMM D")}
            </div>
            <div class="product-quantity">
              Quantity: ${orderItem.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${orderProducts.orderId}&productId=${
      matchingItem.id
    }">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>`;
  });

  return orderProductsHTML;
}
