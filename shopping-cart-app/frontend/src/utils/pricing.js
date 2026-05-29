export function discountPercent(product) {
  const percent = Number(product?.discount_percent || 0);
  return Number.isFinite(percent) && percent > 0 ? percent : 0;
}

export function hasDiscount(product) {
  return discountPercent(product) > 0;
}

export function salePrice(product) {
  const price = Number(product?.price || 0);
  const percent = discountPercent(product);
  return percent ? price * (1 - percent / 100) : price;
}
