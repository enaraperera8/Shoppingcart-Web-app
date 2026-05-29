import pool from "../config/db.js";

const productSelect = `
  SELECT p.id, p.name, p.description, p.price, p.discount_percent, p.stock_quantity, p.unit_grams, p.subcategory, p.image_url,
         p.category_id, c.name AS category_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

export async function findAllProducts({ categoryId, search } = {}) {
  const clauses = [];
  const values = [];
  if (categoryId) {
    clauses.push("p.category_id = ?");
    values.push(categoryId);
  }
  if (search) {
    clauses.push("(p.name LIKE ? OR p.description LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  const whereClause = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await pool.execute(
    `${productSelect}${whereClause} ORDER BY p.created_at DESC`,
    values,
  );
  return rows;
}

export async function findProductById(productId) {
  const [rows] = await pool.execute(`${productSelect} WHERE p.id = ?`, [productId]);
  return rows[0];
}

export async function insertProduct(product) {
  const [result] = await pool.execute(
    `INSERT INTO products
      (name, description, price, discount_percent, stock_quantity, unit_grams, subcategory, image_url, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.name,
      product.description || "",
      product.price,
      product.discount_percent || 0,
      product.stock_quantity || 0,
      product.unit_grams || null,
      product.subcategory || null,
      product.image_url || null,
      product.category_id || null,
    ],
  );
  return findProductById(result.insertId);
}

export async function updateProduct(productId, product) {
  const [result] = await pool.execute(
    `UPDATE products
     SET name = ?, description = ?, price = ?, discount_percent = ?, stock_quantity = ?, unit_grams = ?, subcategory = ?, image_url = ?, category_id = ?
     WHERE id = ?`,
    [
      product.name,
      product.description || "",
      product.price,
      product.discount_percent || 0,
      product.stock_quantity || 0,
      product.unit_grams || null,
      product.subcategory || null,
      product.image_url || null,
      product.category_id || null,
      productId,
    ],
  );
  return result.affectedRows ? findProductById(productId) : null;
}

export async function removeProduct(productId) {
  const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [productId]);
  return result.affectedRows > 0;
}
