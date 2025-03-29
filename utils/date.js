import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function getDate(deliveryOption) {
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, "day");
  const dateString = deliveryDate.format("dddd, MMMM D");

  return dateString;
}

export default getDate;
