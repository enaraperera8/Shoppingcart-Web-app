import pool from "../config/db.js";

export async function findAllCategories() {
  const [rows] = await pool.query(`
    SELECT id, name
    FROM categories
    ORDER BY CASE name
      WHEN 'Vegetables' THEN 1
      WHEN 'Fruits' THEN 2
      WHEN 'Meat & Seafood' THEN 3
      WHEN 'Bakery Items' THEN 4
      WHEN 'Dairy Items' THEN 5
      WHEN 'Sweets & Beverages' THEN 6
      ELSE 7
    END, name
  `);
  return rows;
}

export async function insertCategory(name) {
  const [result] = await pool.execute("INSERT INTO categories (name) VALUES (?)", [name]);
  return { id: result.insertId, name };
}

export async function updateCategory(categoryId, name) {
  const [result] = await pool.execute("UPDATE categories SET name = ? WHERE id = ?", [
    name,
    categoryId,
  ]);
  return result.affectedRows ? { id: Number(categoryId), name } : null;
}

export async function deleteCategory(categoryId) {
  const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [categoryId]);
  return result.affectedRows > 0;
}
