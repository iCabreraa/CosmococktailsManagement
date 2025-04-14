export function getDateColor(date) {
  const today = new Date();
  const delivery = new Date(date);
  const diffDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "red";
  if (diffDays <= 3) return "yellow";
  return "green";
}
