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

  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption, today = dayjs()) {
  // Ensure today is a dayjs object
  let todayObj = today;
  if (!today || typeof today.add !== "function") {
    todayObj = dayjs(today);
  }

  // Add the delivery days to get the initial delivery date
  const daysToAdd = deliveryOption.deliveryDays;
  let deliveryDate = todayObj.add(daysToAdd, "day");

  // Adjust for weekends
  const dayOfWeek = deliveryDate.format("dddd");
  if (dayOfWeek === "Saturday") {
    // Skip to Monday (add 2 days)
    deliveryDate = deliveryDate.add(2, "day");
  } else if (dayOfWeek === "Sunday") {
    // Skip to Monday (add 1 day)
    deliveryDate = deliveryDate.add(1, "day");
  }

  // Return the dayjs object directly
  return deliveryDate;
}
