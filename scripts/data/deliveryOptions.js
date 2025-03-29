import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();

  let deliveryDate = today.add(deliveryOption.deliveryDays, "day");

  if (deliveryDate.format("dddd") === "Saturday") {
    deliveryDate = today.add(deliveryOption.deliveryDays + 2, "day");
  } else if (deliveryDate.format("dddd") === "Sunday") {
    deliveryDate = today.add(deliveryOption.deliveryDays + 1, "day");
  }

  const dateString = deliveryDate.format("dddd, MMMM D");

  return dateString;
}
