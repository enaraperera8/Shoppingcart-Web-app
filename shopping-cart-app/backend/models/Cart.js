import pool from "../config/db.js";

export async function findCartItems(userId) {
  const [rows] = await pool.execute(
    `SELECT ci.product_id AS id, p.name, p.description, p.price, p.discount_percent, p.image_url,
            p.stock_quantity, p.unit_grams, p.subcategory, p.category_id, c.name AS category_name, ci.quantity
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE ci.user_id = ?`,
    [userId],
  );
  return rows;
}

export async function upsertCartItem(userId, productId, quantity) {
  await pool.execute(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
    [userId, productId, quantity],
  );
  return findCartItems(userId);
}

export async function deleteCartItem(userId, productId) {
  await pool.execute("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [
    userId,
    productId,
  ]);
  return findCartItems(userId);
}

export async function clearCartItems(userId) {
  await pool.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);
  return [];
}
