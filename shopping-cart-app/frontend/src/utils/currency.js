export function formatLkr(value) {
  return `Rs. ${Number(value).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
