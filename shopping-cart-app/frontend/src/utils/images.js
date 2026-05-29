const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const assetOrigin = apiUrl.replace(/\/api\/?$/, "");

export function productImageSrc(imageUrl, fallback = "https://placehold.co/420x320?text=Product") {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("/uploads/")) {
    return `${assetOrigin}${imageUrl}`;
  }
  return imageUrl;
}
