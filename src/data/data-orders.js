import { add } from "date-fns";

function fromToday(days) {
  const date = add(new Date(), { days });
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, -1);
}

export const orders = [];
