export function isWeightedProduct(product) {
  return Number(product.unit_grams) > 0;
}

export function formatWeight(grams) {
  const amount = Number(grams);
  if (amount >= 1000 && amount % 1000 === 0) {
    return `${amount / 1000} kg`;
  }
  return `${amount} g`;
}

export function formatProductQuantity(quantity, product) {
  if (isWeightedProduct(product)) {
    return formatWeight(Number(quantity) * Number(product.unit_grams));
  }
  return `${quantity} item${Number(quantity) === 1 ? "" : "s"}`;
}

export function formatProductStock(product) {
  return formatProductQuantity(product.stock_quantity, product);
}

export function maximumOrderQuantity(product) {
  if (!isWeightedProduct(product)) {
    return product.stock_quantity === undefined
      ? Number.MAX_SAFE_INTEGER
      : Number(product.stock_quantity);
  }
  const fiveKilograms = Math.floor(5000 / Number(product.unit_grams));
  return Math.min(Number(product.stock_quantity), fiveKilograms);
}

export function weightOptions(product) {
  if (!isWeightedProduct(product)) {
    return [];
  }
  return Array.from({ length: maximumOrderQuantity(product) }, (_unused, index) => index + 1);
}
