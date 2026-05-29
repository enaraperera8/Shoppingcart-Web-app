USE shopping_cart;

ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) NOT NULL DEFAULT 'password' AFTER password_hash;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255) NULL AFTER auth_provider;

CREATE TABLE IF NOT EXISTS user_passkeys (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  credential_id VARCHAR(512) NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT UNSIGNED NOT NULL DEFAULT 0,
  device_name VARCHAR(120) NULL,
  transports VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT passkeys_user_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS unit_grams INT UNSIGNED NULL AFTER stock_quantity;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100) NULL AFTER unit_grams;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0 AFTER price;

DELETE FROM products
WHERE name IN ('Minimal Backpack', 'Wireless Headphones', 'Classic Sneakers');

DELETE FROM categories
WHERE name IN ('Accessories', 'Electronics', 'Fashion');

INSERT INTO categories (name)
VALUES ('Vegetables'), ('Fruits'), ('Meat & Seafood'), ('Bakery Items'), ('Dairy Items'), ('Sweets & Beverages')
ON DUPLICATE KEY UPDATE name = VALUES(name);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Bakery Items')
WHERE category_id = (SELECT id FROM categories WHERE name = 'Cakes');

UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Sweets & Beverages')
WHERE category_id = (SELECT id FROM categories WHERE name = 'Biscuits');

DELETE FROM categories
WHERE name IN ('Cakes', 'Biscuits');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Fresh Carrots', 'Crisp local carrots, packed for healthy daily meals.', 52.00, 200, 100,
       '/images/vegetables/carrots.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Carrots');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Garden Tomatoes', 'Ripe tomatoes with bright flavor for salads and cooking.', 76.00, 175, 100,
       '/images/vegetables/tomatoes.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garden Tomatoes');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Green Broccoli', 'Fresh broccoli florets full of crunch for stir-fries and steaming.', 148.00, 140, 100,
       '/images/vegetables/broccoli.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Broccoli');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Baby Spinach', 'Tender spinach leaves washed and ready for salads or cooking.', 44.00, 160, 100,
       '/images/vegetables/spinach.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Baby Spinach');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Red Bell Pepper', 'Sweet and crisp red peppers to brighten everyday meals.', 84.00, 185, 100,
       '/images/vegetables/bell-pepper.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Bell Pepper');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Fresh Cucumber', 'Cool crunchy cucumber perfect for salads and sandwiches.', 36.00, 225, 100,
       '/images/vegetables/cucumber.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Cucumber');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Golden Potatoes', 'Versatile golden potatoes ideal for roasting, curries, and mash.', 70.00, 275, 100,
       '/images/vegetables/potatoes.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Potatoes');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Green Beans', 'Crisp young green beans picked for a fresh natural taste.', 58.00, 170, 100,
       '/images/vegetables/green-beans.jpg'
FROM categories WHERE name = 'Vegetables'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Beans');

UPDATE products
SET image_url = CASE name
  WHEN 'Fresh Carrots' THEN '/images/vegetables/carrots.jpg'
  WHEN 'Garden Tomatoes' THEN '/images/vegetables/tomatoes.jpg'
  WHEN 'Green Broccoli' THEN '/images/vegetables/broccoli.jpg'
  WHEN 'Baby Spinach' THEN '/images/vegetables/spinach.jpg'
  WHEN 'Red Bell Pepper' THEN '/images/vegetables/bell-pepper.jpg'
  WHEN 'Fresh Cucumber' THEN '/images/vegetables/cucumber.jpg'
  WHEN 'Golden Potatoes' THEN '/images/vegetables/potatoes.jpg'
  WHEN 'Green Beans' THEN '/images/vegetables/green-beans.jpg'
END
WHERE name IN (
  'Fresh Carrots',
  'Garden Tomatoes',
  'Green Broccoli',
  'Baby Spinach',
  'Red Bell Pepper',
  'Fresh Cucumber',
  'Golden Potatoes',
  'Green Beans'
);

UPDATE products
SET price = CASE name
  WHEN 'Fresh Carrots' THEN 52.00
  WHEN 'Garden Tomatoes' THEN 76.00
  WHEN 'Green Broccoli' THEN 148.00
  WHEN 'Baby Spinach' THEN 44.00
  WHEN 'Red Bell Pepper' THEN 84.00
  WHEN 'Fresh Cucumber' THEN 36.00
  WHEN 'Golden Potatoes' THEN 70.00
  WHEN 'Green Beans' THEN 58.00
  WHEN 'Sweet Apples' THEN 130.00
  WHEN 'Banana Bunch' THEN 72.00
  WHEN 'Ripe Mango' THEN 95.00
  WHEN 'Sweet Papaya' THEN 55.00
  WHEN 'Golden Pineapple' THEN 85.00
  WHEN 'Seedless Grapes' THEN 160.00
  WHEN 'Watermelon' THEN 38.00
  WHEN 'Juicy Oranges' THEN 90.00
  WHEN 'Chocolate Celebration Cake' THEN 4500.00
  WHEN 'Vanilla Berry Cake' THEN 5200.00
  WHEN 'Munchee Snack Cracker' THEN 300.00
  WHEN 'Chocolate Chip Cookies' THEN 750.00
  WHEN 'Atlantic Salmon Fillet' THEN 570.00
  WHEN 'Chicken Breast Pack' THEN 330.00
  WHEN 'Fresh Tuna Steaks' THEN 320.00
  WHEN 'Jumbo Prawns' THEN 460.00
  WHEN 'Seer Fish Slices' THEN 390.00
  WHEN 'Chicken Drumsticks' THEN 290.00
  WHEN 'Beef Curry Cubes' THEN 420.00
  WHEN 'Mutton Curry Cuts' THEN 620.00
  WHEN 'Pork Curry Cuts' THEN 380.00
  WHEN 'Chicken Sausages' THEN 260.00
  WHEN 'Farm Fresh Milk' THEN 490.00
  WHEN 'Creamy Greek Yogurt' THEN 560.00
  WHEN 'Red Bull' THEN 650.00
END
WHERE name IN (
  'Fresh Carrots',
  'Garden Tomatoes',
  'Green Broccoli',
  'Baby Spinach',
  'Red Bell Pepper',
  'Fresh Cucumber',
  'Golden Potatoes',
  'Green Beans',
  'Sweet Apples',
  'Banana Bunch',
  'Ripe Mango',
  'Sweet Papaya',
  'Golden Pineapple',
  'Seedless Grapes',
  'Watermelon',
  'Juicy Oranges',
  'Chocolate Celebration Cake',
  'Vanilla Berry Cake',
  'Munchee Snack Cracker',
  'Chocolate Chip Cookies',
  'Atlantic Salmon Fillet',
  'Chicken Breast Pack',
  'Fresh Tuna Steaks',
  'Jumbo Prawns',
  'Seer Fish Slices',
  'Chicken Drumsticks',
  'Beef Curry Cubes',
  'Mutton Curry Cuts',
  'Pork Curry Cuts',
  'Chicken Sausages',
  'Farm Fresh Milk',
  'Creamy Greek Yogurt',
  'Red Bull'
);

UPDATE cart_items ci
JOIN products p ON p.id = ci.product_id
SET ci.quantity = LEAST(ci.quantity * 5, 50)
WHERE p.unit_grams = 500
AND p.name IN (
  'Fresh Carrots',
  'Garden Tomatoes',
  'Green Broccoli',
  'Baby Spinach',
  'Red Bell Pepper',
  'Fresh Cucumber',
  'Golden Potatoes',
  'Green Beans'
);

UPDATE products
SET stock_quantity = stock_quantity * 5,
    unit_grams = 100
WHERE unit_grams = 500
AND name IN (
  'Fresh Carrots',
  'Garden Tomatoes',
  'Green Broccoli',
  'Baby Spinach',
  'Red Bell Pepper',
  'Fresh Cucumber',
  'Golden Potatoes',
  'Green Beans'
);

UPDATE products
SET unit_grams = 100
WHERE name IN (
  'Fresh Carrots',
  'Garden Tomatoes',
  'Green Broccoli',
  'Baby Spinach',
  'Red Bell Pepper',
  'Fresh Cucumber',
  'Golden Potatoes',
  'Green Beans'
);

UPDATE products
SET unit_grams = 100,
    stock_quantity = CASE name
      WHEN 'Sweet Apples' THEN 210
      WHEN 'Banana Bunch' THEN 180
      WHEN 'Ripe Mango' THEN 160
      WHEN 'Sweet Papaya' THEN 230
      WHEN 'Golden Pineapple' THEN 140
      WHEN 'Seedless Grapes' THEN 100
      WHEN 'Watermelon' THEN 300
      WHEN 'Juicy Oranges' THEN 190
    END
WHERE name IN (
  'Sweet Apples',
  'Banana Bunch',
  'Ripe Mango',
  'Sweet Papaya',
  'Golden Pineapple',
  'Seedless Grapes',
  'Watermelon',
  'Juicy Oranges'
);

UPDATE products
SET image_url = CASE name
  WHEN 'Sweet Apples' THEN '/images/fruits/apples.jpg'
  WHEN 'Banana Bunch' THEN '/images/fruits/bananas.jpg'
  WHEN 'Ripe Mango' THEN '/images/fruits/mango.jpg'
  WHEN 'Sweet Papaya' THEN '/images/fruits/papaya.jpg'
  WHEN 'Golden Pineapple' THEN '/images/fruits/pineapple.jpg'
  WHEN 'Seedless Grapes' THEN '/images/fruits/grapes.jpg'
  WHEN 'Watermelon' THEN '/images/fruits/watermelon.jpg'
  WHEN 'Juicy Oranges' THEN '/images/fruits/oranges.jpg'
END
WHERE name IN (
  'Sweet Apples',
  'Banana Bunch',
  'Ripe Mango',
  'Sweet Papaya',
  'Golden Pineapple',
  'Seedless Grapes',
  'Watermelon',
  'Juicy Oranges'
);

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Sweet Apples', 'Juicy red apples selected for freshness and crunch.', 130.00, 210, 100,
       '/images/fruits/apples.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sweet Apples');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Banana Bunch', 'Naturally sweet bananas, perfect for breakfast and snacks.', 72.00, 180, 100,
       '/images/fruits/bananas.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Banana Bunch');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Ripe Mango', 'Golden sweet mango with a rich tropical aroma.', 95.00, 160, 100,
       '/images/fruits/mango.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ripe Mango');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Sweet Papaya', 'Soft ripe papaya perfect for a refreshing breakfast.', 55.00, 230, 100,
       '/images/fruits/papaya.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sweet Papaya');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Golden Pineapple', 'Fragrant pineapple with juicy golden slices and natural sweetness.', 85.00, 140, 100,
       '/images/fruits/pineapple.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Pineapple');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Seedless Grapes', 'Crisp seedless grapes for easy chilled snacking.', 160.00, 100, 100,
       '/images/fruits/grapes.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Seedless Grapes');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Watermelon', 'Cooling red watermelon selected for juicy summer slices.', 38.00, 300, 100,
       '/images/fruits/watermelon.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Watermelon');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Juicy Oranges', 'Bright citrus oranges full of refreshing natural juice.', 90.00, 190, 100,
       '/images/fruits/oranges.jpg'
FROM categories WHERE name = 'Fruits'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Juicy Oranges');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chocolate Celebration Cake', 'Rich chocolate sponge finished with smooth cocoa frosting.', 4500.00, 10, 'Cakes',
       '/images/bakery/chocolate-cake.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Celebration Cake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Vanilla Berry Cake', 'Soft vanilla layers topped with a fresh berry finish.', 5200.00, 8, 'Cakes',
       '/images/bakery/vanilla-berry-cake.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vanilla Berry Cake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Cheesecake', 'Creamy baked cheesecake with a delicate biscuit base.', 4800.00, 10, 'Cakes',
       '/images/bakery/cheesecake.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cheesecake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Red Velvet Cake', 'Velvety cocoa sponge finished with smooth cream cheese frosting.', 5600.00, 8, 'Cakes',
       '/images/bakery/red-velvet-cake.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Velvet Cake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Butter Cake', 'Classic rich butter cake baked soft and golden.', 1950.00, 14, 'Cakes',
       '/images/bakery/butter-cake.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Butter Cake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Whole Wheat Bread', 'Soft wholesome loaf baked fresh for toast and sandwiches.', 420.00, 18, 'Bread',
       '/images/bakery/whole-wheat-bread.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Whole Wheat Bread');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Milk Bread Loaf', 'Light and tender white loaf with a soft milky crumb.', 390.00, 20, 'Bread',
       '/images/bakery/milk-bread.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Milk Bread Loaf');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Garlic Bread Loaf', 'Soft baked loaf brushed with garlic butter and herbs.', 650.00, 18, 'Bread',
       '/images/bakery/garlic-bread.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garlic Bread Loaf');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Multigrain Bread', 'Wholesome sliced loaf packed with grains and seeds.', 560.00, 16, 'Bread',
       '/images/bakery/multigrain-bread.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Multigrain Bread');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Butter Croissant', 'Flaky golden pastry layered with rich buttery flavour.', 290.00, 24, 'Pastries',
       '/images/bakery/butter-croissant.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Butter Croissant');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Fruit Danish', 'Crisp pastry finished with a bright fruit centre.', 340.00, 16, 'Pastries',
       '/images/bakery/fruit-danish.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fruit Danish');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chicken Puff Pastry', 'Flaky pastry pocket filled with savoury spiced chicken.', 320.00, 22, 'Pastries',
       '/images/bakery/chicken-puff.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Puff Pastry');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chocolate Eclair', 'Light choux pastry with cream filling and chocolate topping.', 380.00, 20, 'Pastries',
       '/images/bakery/chocolate-eclair.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Eclair');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Soft Dinner Buns', 'Pillowy oven-fresh buns prepared for sharing at the table.', 360.00, 20, 'Buns',
       '/images/bakery/dinner-buns.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Soft Dinner Buns');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Cream Bun', 'Soft sweet bun filled with smooth vanilla cream.', 180.00, 28, 'Buns',
       '/images/bakery/cream-bun.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cream Bun');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Fish Bun', 'Sri Lankan bakery bun filled with spicy fish and potato.', 180.00, 30, 'Buns',
       '/images/bakery/fish-bun.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fish Bun');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chicken Bun', 'Soft golden bun packed with a savoury chicken filling.', 230.00, 26, 'Buns',
       '/images/bakery/chicken-bun.jpg'
FROM categories WHERE name = 'Bakery Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Bun');

UPDATE products
SET subcategory = 'Cakes'
WHERE name IN ('Chocolate Celebration Cake', 'Vanilla Berry Cake', 'Cheesecake', 'Red Velvet Cake', 'Butter Cake');

UPDATE products
SET image_url = CASE name
  WHEN 'Chocolate Celebration Cake' THEN '/images/bakery/chocolate-cake.jpg'
  WHEN 'Vanilla Berry Cake' THEN '/images/bakery/vanilla-berry-cake.jpg'
  WHEN 'Cheesecake' THEN '/images/bakery/cheesecake.jpg'
  WHEN 'Red Velvet Cake' THEN '/images/bakery/red-velvet-cake.jpg'
  WHEN 'Butter Cake' THEN '/images/bakery/butter-cake.jpg'
  WHEN 'Whole Wheat Bread' THEN '/images/bakery/whole-wheat-bread.jpg'
  WHEN 'Milk Bread Loaf' THEN '/images/bakery/milk-bread.jpg'
  WHEN 'Garlic Bread Loaf' THEN '/images/bakery/garlic-bread.jpg'
  WHEN 'Multigrain Bread' THEN '/images/bakery/multigrain-bread.jpg'
  WHEN 'Butter Croissant' THEN '/images/bakery/butter-croissant.jpg'
  WHEN 'Fruit Danish' THEN '/images/bakery/fruit-danish.jpg'
  WHEN 'Chicken Puff Pastry' THEN '/images/bakery/chicken-puff.jpg'
  WHEN 'Chocolate Eclair' THEN '/images/bakery/chocolate-eclair.jpg'
  WHEN 'Soft Dinner Buns' THEN '/images/bakery/dinner-buns.jpg'
  WHEN 'Cream Bun' THEN '/images/bakery/cream-bun.jpg'
  WHEN 'Fish Bun' THEN '/images/bakery/fish-bun.jpg'
  WHEN 'Chicken Bun' THEN '/images/bakery/chicken-bun.jpg'
  ELSE image_url
END
WHERE name IN (
  'Chocolate Celebration Cake', 'Vanilla Berry Cake', 'Cheesecake', 'Red Velvet Cake',
  'Butter Cake', 'Whole Wheat Bread', 'Milk Bread Loaf', 'Garlic Bread Loaf',
  'Multigrain Bread', 'Butter Croissant', 'Fruit Danish', 'Chicken Puff Pastry',
  'Chocolate Eclair', 'Soft Dinner Buns', 'Cream Bun', 'Fish Bun', 'Chicken Bun'
);

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Munchee Snack Cracker', 'Crisp Munchee snack crackers for tea time and quick bites.', 300.00, 50, 'Biscuits',
       '/images/biscuits/munchee-snack-cracker.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Munchee Snack Cracker');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chocolate Puff', 'Crisp puff biscuits with a rich chocolate cream filling.', 360.00, 45, 'Biscuits',
       '/images/biscuits/chocolate-puff.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Puff');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Lemon Puff', 'Light puff biscuits layered with tangy lemon cream.', 340.00, 48, 'Biscuits',
       '/images/biscuits/lemon-puff.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lemon Puff');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Tikiri Marie', 'Classic Marie biscuits with a gentle milky crunch.', 220.00, 60, 'Biscuits',
       '/images/biscuits/tikiri-marie.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tikiri Marie');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Ginger Biscuits', 'Crunchy biscuits with a warm ginger bite.', 300.00, 42, 'Biscuits',
       '/images/biscuits/ginger-biscuits.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ginger Biscuits');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Cream Crackers', 'Crisp savoury crackers for tea time and snacks.', 260.00, 55, 'Biscuits',
       '/images/biscuits/cream-crackers.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cream Crackers');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Krisco', 'Flaky biscuit crackers with a light, crisp texture.', 280.00, 50, 'Biscuits',
       '/images/biscuits/krisco.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Krisco');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Milk Short Cake', 'Sweet milk biscuits with a soft shortcake-style crunch.', 320.00, 46, 'Biscuits',
       '/images/biscuits/milk-short-cake.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Milk Short Cake');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Nice', 'Sugar-topped coconut-style biscuits for a simple sweet snack.', 240.00, 52, 'Biscuits',
       '/images/biscuits/nice.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nice');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Cheese Bits', 'Bite-sized savoury cheese biscuits with a crisp finish.', 380.00, 40, 'Biscuits',
       '/images/biscuits/cheese-bits.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cheese Bits');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Butter Cookies', 'Sweet buttery cookies with a rich, melt-in-the-mouth crunch.', 620.00, 44, 'Sweets',
       '/images/biscuits/butter-cookies.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Butter Cookies');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chocolate Chip Cookies', 'Crunchy biscuits dotted with generous chocolate chips.', 750.00, 45, 'Sweets',
       '/images/sweets/chocolate-chip-cookies.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Chip Cookies');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Ritzbury Chocolate Fingers', 'Chocolate-coated wafer fingers for a crisp sweet treat.', 520.00, 42, 'Sweets',
       '/images/sweets/ritzbury-chocolate-fingers.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ritzbury Chocolate Fingers');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Ritzbury Pebbles', 'Colorful candy-coated chocolate pieces.', 280.00, 55, 'Sweets',
       '/images/sweets/ritzbury-pebbles.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ritzbury Pebbles');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Ritzbury Choco Mo', 'Soft chocolate snack with a creamy cocoa bite.', 240.00, 50, 'Sweets',
       '/images/sweets/ritzbury-choco-mo.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ritzbury Choco Mo');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Chunky Choc', 'Chocolate-coated wafer bars with a chunky cocoa crunch.', 380.00, 46, 'Sweets',
       '/images/sweets/chunky-choc.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chunky Choc');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'KitKat', 'Crisp wafer fingers covered in smooth milk chocolate.', 450.00, 48, 'Sweets',
       '/images/sweets/kitkat.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'KitKat');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Milk Toffee', 'Traditional creamy milk toffee with a rich caramel flavor.', 180.00, 60, 'Sweets',
       '/images/sweets/milk-toffee.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Milk Toffee');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Coconut Toffee', 'Sweet coconut toffee pieces with a chewy texture.', 180.00, 58, 'Sweets',
       '/images/sweets/coconut-toffee.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coconut Toffee');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Unduwal', 'Traditional sweet rings made for festive snacking.', 260.00, 35, 'Sweets',
       '/images/sweets/unduwal.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Unduwal');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Lollipops', 'Assorted fruity lollipops for a fun sweet treat.', 120.00, 80, 'Sweets',
       '/images/sweets/lollipops.jpg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lollipops');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Elephant House Cream Soda', 'Classic Sri Lankan cream soda served chilled.', 220.00, 48, 'Beverages',
       '/images/beverages/cream-soda.jpeg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Elephant House Cream Soda');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Coca-Cola', 'Refreshing cola drink for meals and snacks.', 240.00, 55, 'Beverages',
       '/images/beverages/coca-cola.jpeg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coca-Cola');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Sprite', 'Crisp lemon-lime soft drink served cold.', 240.00, 52, 'Beverages',
       '/images/beverages/sprite.jpeg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sprite');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'MD Mixed Fruit Nectar', 'Thick mixed fruit nectar with a sweet tropical taste.', 360.00, 36, 'Beverages',
       '/images/beverages/md-mixed-fruit-nectar.jpeg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'MD Mixed Fruit Nectar');

UPDATE products
SET subcategory = CASE name
  WHEN 'Munchee Snack Cracker' THEN 'Biscuits'
  WHEN 'Butter Cookies' THEN 'Sweets'
  WHEN 'Chocolate Chip Cookies' THEN 'Sweets'
  WHEN 'Red Bull' THEN 'Beverages'
  ELSE subcategory
END
WHERE name IN ('Munchee Snack Cracker', 'Butter Cookies', 'Chocolate Chip Cookies', 'Red Bull');

UPDATE products
SET unit_grams = 100,
    stock_quantity = CASE name
      WHEN 'Atlantic Salmon Fillet' THEN 90
      WHEN 'Chicken Breast Pack' THEN 120
      WHEN 'Fresh Tuna Steaks' THEN 120
      WHEN 'Jumbo Prawns' THEN 80
      WHEN 'Seer Fish Slices' THEN 100
      WHEN 'Chicken Drumsticks' THEN 150
      WHEN 'Beef Curry Cubes' THEN 95
      WHEN 'Mutton Curry Cuts' THEN 75
      WHEN 'Pork Curry Cuts' THEN 100
      WHEN 'Chicken Sausages' THEN 110
    END
WHERE name IN (
  'Atlantic Salmon Fillet',
  'Chicken Breast Pack',
  'Fresh Tuna Steaks',
  'Jumbo Prawns',
  'Seer Fish Slices',
  'Chicken Drumsticks',
  'Beef Curry Cubes',
  'Mutton Curry Cuts',
  'Pork Curry Cuts',
  'Chicken Sausages'
);

UPDATE products
SET image_url = CASE name
  WHEN 'Atlantic Salmon Fillet' THEN '/images/meat-seafood/salmon.jpg'
  WHEN 'Chicken Breast Pack' THEN '/images/meat-seafood/chicken.jpg'
  WHEN 'Fresh Tuna Steaks' THEN '/images/meat-seafood/tuna.jpg'
  WHEN 'Jumbo Prawns' THEN '/images/meat-seafood/prawns.jpg'
  WHEN 'Seer Fish Slices' THEN '/images/meat-seafood/seer-fish.jpg'
  WHEN 'Chicken Drumsticks' THEN '/images/meat-seafood/drumsticks.jpg'
  WHEN 'Beef Curry Cubes' THEN '/images/meat-seafood/beef.jpg'
  WHEN 'Mutton Curry Cuts' THEN '/images/meat-seafood/mutton.jpg'
  WHEN 'Pork Curry Cuts' THEN '/images/meat-seafood/pork.jpg'
  WHEN 'Chicken Sausages' THEN '/images/meat-seafood/sausages.jpg'
END
WHERE name IN (
  'Atlantic Salmon Fillet',
  'Chicken Breast Pack',
  'Fresh Tuna Steaks',
  'Jumbo Prawns',
  'Seer Fish Slices',
  'Chicken Drumsticks',
  'Beef Curry Cubes',
  'Mutton Curry Cuts',
  'Pork Curry Cuts',
  'Chicken Sausages'
);

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Atlantic Salmon Fillet', 'Tender salmon portion prepared for a fresh family dinner.', 570.00, 90, 100,
       '/images/meat-seafood/salmon.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Atlantic Salmon Fillet');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Chicken Breast Pack', 'Lean chicken breasts packed fresh for weekday cooking.', 330.00, 120, 100,
       '/images/meat-seafood/chicken.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Breast Pack');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Fresh Tuna Steaks', 'Firm ocean-fresh tuna steaks suitable for grilling or curry.', 320.00, 120, 100,
       '/images/meat-seafood/tuna.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Tuna Steaks');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Jumbo Prawns', 'Succulent prawns cleaned for quick seafood meals.', 460.00, 80, 100,
       '/images/meat-seafood/prawns.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Jumbo Prawns');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Seer Fish Slices', 'Fresh seer fish slices selected for fragrant Sri Lankan curry.', 390.00, 100, 100,
       '/images/meat-seafood/seer-fish.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Seer Fish Slices');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Chicken Drumsticks', 'Fresh chicken drumsticks for roasting or spiced curries.', 290.00, 150, 100,
       '/images/meat-seafood/drumsticks.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Drumsticks');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Beef Curry Cubes', 'Tender beef cubes cut for rich slow-cooked curry.', 420.00, 95, 100,
       '/images/meat-seafood/beef.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Beef Curry Cubes');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Mutton Curry Cuts', 'Premium mutton cuts ready for a comforting family curry.', 620.00, 75, 100,
       '/images/meat-seafood/mutton.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mutton Curry Cuts');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Pork Curry Cuts', 'Fresh pork pieces trimmed and prepared for rich curry dishes.', 380.00, 100, 100,
       '/images/meat-seafood/pork.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pork Curry Cuts');

INSERT INTO products (category_id, name, description, price, stock_quantity, unit_grams, image_url)
SELECT id, 'Chicken Sausages', 'Savory chicken sausages for quick grills and breakfast plates.', 260.00, 110, 100,
       '/images/meat-seafood/sausages.jpg'
FROM categories WHERE name = 'Meat & Seafood'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Sausages');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Farm Fresh Milk', 'Chilled whole milk for breakfast, tea, and baking.', 490.00, 25, 'Dairy Products',
       '/images/dairy/fresh-milk.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Farm Fresh Milk');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Creamy Greek Yogurt', 'Smooth natural yogurt with a creamy cultured taste.', 560.00, 22, 'Dairy Products',
       '/images/dairy/greek-yogurt.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Creamy Greek Yogurt');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Yogurt', 'Fresh plain yogurt with a smooth creamy texture.', 180.00, 36, 'Dairy Products',
       '/images/dairy/yogurt.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Yogurt');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Cheddar Cheese Block', 'Rich cheddar cheese block for sandwiches, pasta, and snacks.', 1180.00, 18, 'Dairy Products',
       '/images/dairy/cheddar-cheese.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cheddar Cheese Block');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Salted Butter', 'Creamy salted butter for toast, baking, and everyday cooking.', 740.00, 20, 'Dairy Products',
       '/images/dairy/butter.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salted Butter');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Fresh Curd Pot', 'Traditional set curd with a smooth texture and mild tang.', 420.00, 24, 'Dairy Products',
       '/images/dairy/curd.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Curd Pot');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Whipping Cream', 'Chilled dairy cream ready for desserts, cakes, and sauces.', 890.00, 14, 'Dairy Products',
       '/images/dairy/whipping-cream.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Whipping Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Full Cream Milk Powder', 'Full cream milk powder for tea, coffee, and family breakfasts.', 1320.00, 30, 'Dairy Products',
       '/images/dairy/milk-powder.jpg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Full Cream Milk Powder');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Highland Vanilla Ice Cream', 'Smooth Highland vanilla ice cream with a classic creamy taste.', 980.00, 24, 'Ice Cream',
       '/images/dairy/highland-vanilla-ice-cream.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Highland Vanilla Ice Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Highland Chocolate Ice Cream', 'Rich Highland chocolate ice cream with a deep cocoa flavor.', 1050.00, 22, 'Ice Cream',
       '/images/dairy/highland-chocolate-ice-cream.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Highland Chocolate Ice Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Highland Strawberry Ice Cream', 'Creamy Highland strawberry ice cream with a fruity finish.', 1050.00, 22, 'Ice Cream',
       '/images/dairy/highland-strawberry-ice-cream.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Highland Strawberry Ice Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Highland Butterscotch Ice Cream', 'Buttery Highland butterscotch ice cream with caramel notes.', 1120.00, 20, 'Ice Cream',
       '/images/dairy/highland-butterscotch-ice-cream.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Highland Butterscotch Ice Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Highland Fruit & Nut Ice Cream', 'Creamy Highland ice cream mixed with fruit and nut pieces.', 1180.00, 18, 'Ice Cream',
       '/images/dairy/highland-fruit-nut-ice-cream.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Highland Fruit & Nut Ice Cream');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Wonder Cone Vanilla', 'Crispy cone filled with creamy vanilla ice cream.', 260.00, 36, 'Ice Cream',
       '/images/dairy/wonder-cone-vanilla.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wonder Cone Vanilla');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Wonder Cone Chocolate', 'Crispy cone filled with rich chocolate ice cream.', 280.00, 34, 'Ice Cream',
       '/images/dairy/wonder-cone-chocolate.jpeg'
FROM categories WHERE name = 'Dairy Items'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wonder Cone Chocolate');

INSERT INTO products (category_id, name, description, price, stock_quantity, subcategory, image_url)
SELECT id, 'Red Bull', 'Classic energy drink with a bold, refreshing taste.', 650.00, 34, 'Beverages',
       '/images/beverages/red-bull.jpeg'
FROM categories WHERE name = 'Sweets & Beverages'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Bull');
