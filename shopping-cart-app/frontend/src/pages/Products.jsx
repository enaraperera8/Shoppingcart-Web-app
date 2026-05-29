import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { formatLkr } from "../utils/currency";
import { productImageSrc } from "../utils/images";
import { discountPercent, hasDiscount, salePrice } from "../utils/pricing";
import "../styles/Home.css";

const starterProducts = [
  {
    id: 1,
    category_id: 1,
    category_name: "Vegetables",
    name: "Fresh Carrots",
    description: "Crisp local carrots, packed for daily meals.",
    price: 52,
    stock_quantity: 200,
    unit_grams: 100,
    image_url: "/images/vegetables/carrots.jpg",
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Vegetables",
    name: "Green Broccoli",
    description: "Fresh broccoli florets full of crunch for easy meals.",
    price: 148,
    stock_quantity: 140,
    unit_grams: 100,
    image_url: "/images/vegetables/broccoli.jpg",
  },
  {
    id: 3,
    category_id: 1,
    category_name: "Vegetables",
    name: "Baby Spinach",
    description: "Tender spinach leaves ready for salads or cooking.",
    price: 44,
    stock_quantity: 160,
    unit_grams: 100,
    image_url: "/images/vegetables/spinach.jpg",
  },
  {
    id: 41,
    category_id: 1,
    category_name: "Vegetables",
    name: "Garden Tomatoes",
    description: "Ripe tomatoes with bright flavor for salads and cooking.",
    price: 76,
    stock_quantity: 175,
    unit_grams: 100,
    image_url: "/images/vegetables/tomatoes.jpg",
  },
  {
    id: 42,
    category_id: 1,
    category_name: "Vegetables",
    name: "Red Bell Pepper",
    description: "Sweet and crisp red pepper to brighten everyday meals.",
    price: 84,
    stock_quantity: 185,
    unit_grams: 100,
    image_url: "/images/vegetables/bell-pepper.jpg",
  },
  {
    id: 43,
    category_id: 1,
    category_name: "Vegetables",
    name: "Fresh Cucumber",
    description: "Cool crunchy cucumber perfect for salads and sandwiches.",
    price: 36,
    stock_quantity: 225,
    unit_grams: 100,
    image_url: "/images/vegetables/cucumber.jpg",
  },
  {
    id: 44,
    category_id: 1,
    category_name: "Vegetables",
    name: "Golden Potatoes",
    description: "Versatile potatoes ideal for roasting, curries, and mash.",
    price: 70,
    stock_quantity: 275,
    unit_grams: 100,
    image_url: "/images/vegetables/potatoes.jpg",
  },
  {
    id: 45,
    category_id: 1,
    category_name: "Vegetables",
    name: "Green Beans",
    description: "Crisp young green beans picked for a fresh natural taste.",
    price: 58,
    stock_quantity: 170,
    unit_grams: 100,
    image_url: "/images/vegetables/green-beans.jpg",
  },
  {
    id: 4,
    category_id: 2,
    category_name: "Fruits",
    name: "Sweet Apples",
    description: "Juicy apples selected for freshness and flavor.",
    price: 130,
    stock_quantity: 210,
    unit_grams: 100,
    image_url: "/images/fruits/apples.jpg",
  },
  {
    id: 5,
    category_id: 2,
    category_name: "Fruits",
    name: "Ripe Mango",
    description: "Golden sweet mango with a rich tropical aroma.",
    price: 95,
    stock_quantity: 160,
    unit_grams: 100,
    image_url: "/images/fruits/mango.jpg",
  },
  {
    id: 6,
    category_id: 2,
    category_name: "Fruits",
    name: "Sweet Papaya",
    description: "Soft ripe papaya perfect for a refreshing breakfast.",
    price: 55,
    stock_quantity: 230,
    unit_grams: 100,
    image_url: "/images/fruits/papaya.jpg",
  },
  {
    id: 36,
    category_id: 2,
    category_name: "Fruits",
    name: "Banana Bunch",
    description: "Naturally sweet bananas, perfect for breakfast and snacks.",
    price: 72,
    stock_quantity: 180,
    unit_grams: 100,
    image_url: "/images/fruits/bananas.jpg",
  },
  {
    id: 37,
    category_id: 2,
    category_name: "Fruits",
    name: "Golden Pineapple",
    description:
      "Fragrant pineapple with juicy golden slices and natural sweetness.",
    price: 85,
    stock_quantity: 140,
    unit_grams: 100,
    image_url: "/images/fruits/pineapple.jpg",
  },
  {
    id: 38,
    category_id: 2,
    category_name: "Fruits",
    name: "Seedless Grapes",
    description: "Crisp seedless grapes for easy chilled snacking.",
    price: 160,
    stock_quantity: 100,
    unit_grams: 100,
    image_url: "/images/fruits/grapes.jpg",
  },
  {
    id: 39,
    category_id: 2,
    category_name: "Fruits",
    name: "Watermelon",
    description: "Cooling red watermelon selected for juicy summer slices.",
    price: 38,
    stock_quantity: 300,
    unit_grams: 100,
    image_url: "/images/fruits/watermelon.jpg",
  },
  {
    id: 40,
    category_id: 2,
    category_name: "Fruits",
    name: "Juicy Oranges",
    description: "Bright citrus oranges full of refreshing natural juice.",
    price: 90,
    stock_quantity: 190,
    unit_grams: 100,
    image_url: "/images/fruits/oranges.jpg",
  },
  {
    id: 7,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Atlantic Salmon Fillet",
    description: "Tender salmon portion ready for a nourishing dinner.",
    price: 570,
    stock_quantity: 90,
    unit_grams: 100,
    image_url: "/images/meat-seafood/salmon.jpg",
  },
  {
    id: 8,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Fresh Tuna Steaks",
    description: "Firm ocean-fresh tuna steaks suitable for grilling or curry.",
    price: 320,
    stock_quantity: 120,
    unit_grams: 100,
    image_url: "/images/meat-seafood/tuna.jpg",
  },
  {
    id: 9,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Jumbo Prawns",
    description: "Succulent prawns cleaned for quick seafood meals.",
    price: 460,
    stock_quantity: 80,
    unit_grams: 100,
    image_url: "/images/meat-seafood/prawns.jpg",
  },
  {
    id: 10,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Pork Curry Cuts",
    description:
      "Fresh pork pieces trimmed and prepared for rich curry dishes.",
    price: 380,
    stock_quantity: 100,
    unit_grams: 100,
    image_url: "/images/meat-seafood/pork.jpg",
  },
  {
    id: 11,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Chicken Sausages",
    description:
      "Savory chicken sausages for quick grills and breakfast plates.",
    price: 260,
    stock_quantity: 110,
    unit_grams: 100,
    image_url: "/images/meat-seafood/sausages.jpg",
  },
  {
    id: 12,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Chicken Breast Pack",
    description: "Lean chicken breasts packed fresh for weekday cooking.",
    price: 330,
    stock_quantity: 120,
    unit_grams: 100,
    image_url: "/images/meat-seafood/chicken.jpg",
  },
  {
    id: 13,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Seer Fish Slices",
    description:
      "Fresh seer fish slices selected for fragrant Sri Lankan curry.",
    price: 390,
    stock_quantity: 100,
    unit_grams: 100,
    image_url: "/images/meat-seafood/seer-fish.jpg",
  },
  {
    id: 14,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Chicken Drumsticks",
    description: "Fresh chicken drumsticks for roasting or spiced curries.",
    price: 290,
    stock_quantity: 150,
    unit_grams: 100,
    image_url: "/images/meat-seafood/drumsticks.jpg",
  },
  {
    id: 15,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Beef Curry Cubes",
    description: "Tender beef cubes cut for rich slow-cooked curry.",
    price: 420,
    stock_quantity: 95,
    unit_grams: 100,
    image_url: "/images/meat-seafood/beef.jpg",
  },
  {
    id: 16,
    category_id: 3,
    category_name: "Meat & Seafood",
    name: "Mutton Curry Cuts",
    description: "Premium mutton cuts ready for a comforting family curry.",
    price: 620,
    stock_quantity: 75,
    unit_grams: 100,
    image_url: "/images/meat-seafood/mutton.jpg",
  },
  {
    id: 17,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Cakes",
    name: "Chocolate Celebration Cake",
    description: "Soft chocolate cake for celebrations and treats.",
    price: 4500,
    stock_quantity: 10,
    image_url: "/images/bakery/chocolate-cake.jpg",
  },
  {
    id: 20,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Bread",
    name: "Whole Wheat Bread",
    description: "Soft wholesome loaf baked fresh for toast and sandwiches.",
    price: 420,
    stock_quantity: 18,
    image_url: "/images/bakery/whole-wheat-bread.jpg",
  },
  {
    id: 23,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Cakes",
    name: "Vanilla Berry Cake",
    description: "Soft vanilla layers topped with a fresh berry finish.",
    price: 5200,
    stock_quantity: 8,
    image_url: "/images/bakery/vanilla-berry-cake.jpg",
  },
  {
    id: 27,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Cakes",
    name: "Cheesecake",
    description: "Creamy baked cheesecake with a delicate biscuit base.",
    price: 4800,
    stock_quantity: 10,
    image_url: "/images/bakery/cheesecake.jpg",
  },
  {
    id: 28,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Cakes",
    name: "Red Velvet Cake",
    description:
      "Velvety cocoa sponge finished with smooth cream cheese frosting.",
    price: 5600,
    stock_quantity: 8,
    image_url: "/images/bakery/red-velvet-cake.jpg",
  },
  {
    id: 29,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Cakes",
    name: "Butter Cake",
    description: "Classic rich butter cake baked soft and golden.",
    price: 1950,
    stock_quantity: 14,
    image_url: "/images/bakery/butter-cake.jpg",
  },
  {
    id: 24,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Bread",
    name: "Milk Bread Loaf",
    description: "Light and tender white loaf with a soft milky crumb.",
    price: 390,
    stock_quantity: 20,
    image_url: "/images/bakery/milk-bread.jpg",
  },
  {
    id: 30,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Bread",
    name: "Garlic Bread Loaf",
    description: "Soft baked loaf brushed with garlic butter and herbs.",
    price: 650,
    stock_quantity: 18,
    image_url: "/images/bakery/garlic-bread.jpg",
  },
  {
    id: 31,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Bread",
    name: "Multigrain Bread",
    description: "Wholesome sliced loaf packed with grains and seeds.",
    price: 560,
    stock_quantity: 16,
    image_url: "/images/bakery/multigrain-bread.jpg",
  },
  {
    id: 21,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Pastries",
    name: "Butter Croissant",
    description: "Flaky golden pastry layered with rich buttery flavour.",
    price: 290,
    stock_quantity: 24,
    image_url: "/images/bakery/butter-croissant.jpg",
  },
  {
    id: 22,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Buns",
    name: "Soft Dinner Buns",
    description: "Pillowy oven-fresh buns prepared for sharing at the table.",
    price: 360,
    stock_quantity: 20,
    image_url: "/images/bakery/dinner-buns.jpg",
  },
  {
    id: 25,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Pastries",
    name: "Fruit Danish",
    description: "Crisp pastry finished with a bright fruit centre.",
    price: 340,
    stock_quantity: 16,
    image_url: "/images/bakery/fruit-danish.jpg",
  },
  {
    id: 32,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Pastries",
    name: "Chicken Puff Pastry",
    description: "Flaky pastry pocket filled with savoury spiced chicken.",
    price: 320,
    stock_quantity: 22,
    image_url: "/images/bakery/chicken-puff.jpg",
  },
  {
    id: 33,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Pastries",
    name: "Chocolate Eclair",
    description: "Light choux pastry with cream filling and chocolate topping.",
    price: 380,
    stock_quantity: 20,
    image_url: "/images/bakery/chocolate-eclair.jpg",
  },
  {
    id: 26,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Buns",
    name: "Cream Bun",
    description: "Soft sweet bun filled with smooth vanilla cream.",
    price: 180,
    stock_quantity: 28,
    image_url: "/images/bakery/cream-bun.jpg",
  },
  {
    id: 34,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Buns",
    name: "Fish Bun",
    description: "Sri Lankan bakery bun filled with spicy fish and potato.",
    price: 180,
    stock_quantity: 30,
    image_url: "/images/bakery/fish-bun.jpg",
  },
  {
    id: 35,
    category_id: 4,
    category_name: "Bakery Items",
    subcategory: "Buns",
    name: "Chicken Bun",
    description: "Soft golden bun packed with a savoury chicken filling.",
    price: 230,
    stock_quantity: 26,
    image_url: "/images/bakery/chicken-bun.jpg",
  },
  {
    id: 18,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Farm Fresh Milk",
    description: "Chilled whole milk for breakfast and baking.",
    price: 490,
    stock_quantity: 25,
    image_url: "/images/dairy/fresh-milk.jpg",
  },
  {
    id: 46,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Creamy Greek Yogurt",
    description: "Smooth natural yogurt with a creamy cultured taste.",
    price: 560,
    stock_quantity: 22,
    image_url: "/images/dairy/greek-yogurt.jpg",
  },
  {
    id: 52,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Yogurt",
    description: "Fresh plain yogurt with a smooth creamy texture.",
    price: 180,
    stock_quantity: 36,
    image_url: "/images/dairy/yogurt.jpg",
  },
  {
    id: 47,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Cheddar Cheese Block",
    description: "Rich cheddar cheese block for sandwiches, pasta, and snacks.",
    price: 1180,
    stock_quantity: 18,
    image_url: "/images/dairy/cheddar-cheese.jpg",
  },
  {
    id: 48,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Salted Butter",
    description:
      "Creamy salted butter for toast, baking, and everyday cooking.",
    price: 740,
    stock_quantity: 20,
    image_url: "/images/dairy/butter.jpg",
  },
  {
    id: 49,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Fresh Curd Pot",
    description: "Traditional set curd with a smooth texture and mild tang.",
    price: 420,
    stock_quantity: 24,
    image_url: "/images/dairy/curd.jpg",
  },
  {
    id: 50,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Whipping Cream",
    description: "Chilled dairy cream ready for desserts, cakes, and sauces.",
    price: 890,
    stock_quantity: 14,
    image_url: "/images/dairy/whipping-cream.jpg",
  },
  {
    id: 51,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Dairy Products",
    name: "Full Cream Milk Powder",
    description:
      "Full cream milk powder for tea, coffee, and family breakfasts.",
    price: 1320,
    stock_quantity: 30,
    image_url: "/images/dairy/milk-powder.jpg",
  },
  {
    id: 78,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Highland Vanilla Ice Cream",
    description:
      "Smooth Highland vanilla ice cream with a classic creamy taste.",
    price: 980,
    stock_quantity: 24,
    image_url: "/images/dairy/highland-vanilla-ice-cream.jpeg",
  },
  {
    id: 79,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Highland Chocolate Ice Cream",
    description: "Rich Highland chocolate ice cream with a deep cocoa flavor.",
    price: 1050,
    stock_quantity: 22,
    image_url: "/images/dairy/highland-chocolate-ice-cream.jpeg",
  },
  {
    id: 80,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Highland Strawberry Ice Cream",
    description: "Creamy Highland strawberry ice cream with a fruity finish.",
    price: 1050,
    stock_quantity: 22,
    image_url: "/images/dairy/highland-strawberry-ice-cream.jpeg",
  },
  {
    id: 81,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Highland Butterscotch Ice Cream",
    description: "Buttery Highland butterscotch ice cream with caramel notes.",
    price: 1120,
    stock_quantity: 20,
    image_url: "/images/dairy/highland-butterscotch-ice-cream.jpeg",
  },
  {
    id: 82,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Highland Fruit & Nut Ice Cream",
    description: "Creamy Highland ice cream mixed with fruit and nut pieces.",
    price: 1180,
    stock_quantity: 18,
    image_url: "/images/dairy/highland-fruit-nut-ice-cream.jpeg",
  },
  {
    id: 83,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Wonder Cone Vanilla",
    description: "Crispy cone filled with creamy vanilla ice cream.",
    price: 260,
    stock_quantity: 36,
    image_url: "/images/dairy/wonder-cone-vanilla.jpeg",
  },
  {
    id: 84,
    category_id: 5,
    category_name: "Dairy Items",
    subcategory: "Ice Cream",
    name: "Wonder Cone Chocolate",
    description: "Crispy cone filled with rich chocolate ice cream.",
    price: 280,
    stock_quantity: 34,
    image_url: "/images/dairy/wonder-cone-chocolate.jpeg",
  },
  {
    id: 19,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Munchee Snack Cracker",
    description: "Crisp Munchee snack crackers for tea time and quick bites.",
    price: 300,
    stock_quantity: 50,
    image_url: "/images/biscuits/munchee-snack-cracker.jpg",
  },
  {
    id: 55,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Chocolate Puff",
    description: "Crisp puff biscuits with a rich chocolate cream filling.",
    price: 360,
    stock_quantity: 45,
    image_url: "/images/biscuits/chocolate-puff.jpg",
  },
  {
    id: 56,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Lemon Puff",
    description: "Light puff biscuits layered with tangy lemon cream.",
    price: 340,
    stock_quantity: 48,
    image_url: "/images/biscuits/lemon-puff.jpg",
  },
  {
    id: 57,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Tikiri Marie",
    description: "Classic Marie biscuits with a gentle milky crunch.",
    price: 220,
    stock_quantity: 60,
    image_url: "/images/biscuits/tikiri-marie.jpg",
  },
  {
    id: 58,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Ginger Biscuits",
    description: "Crunchy biscuits with a warm ginger bite.",
    price: 300,
    stock_quantity: 42,
    image_url: "/images/biscuits/ginger-biscuits.jpg",
  },
  {
    id: 59,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Cream Crackers",
    description: "Crisp savoury crackers for tea time and snacks.",
    price: 260,
    stock_quantity: 55,
    image_url: "/images/biscuits/cream-crackers.jpg",
  },
  {
    id: 60,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Krisco",
    description: "Flaky biscuit crackers with a light, crisp texture.",
    price: 280,
    stock_quantity: 50,
    image_url: "/images/biscuits/krisco.jpg",
  },
  {
    id: 61,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Milk Short Cake",
    description: "Sweet milk biscuits with a soft shortcake-style crunch.",
    price: 320,
    stock_quantity: 46,
    image_url: "/images/biscuits/milk-short-cake.jpg",
  },
  {
    id: 62,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Nice",
    description:
      "Sugar-topped coconut-style biscuits for a simple sweet snack.",
    price: 240,
    stock_quantity: 52,
    image_url: "/images/biscuits/nice.jpg",
  },
  {
    id: 63,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Biscuits",
    name: "Cheese Bits",
    description: "Bite-sized savoury cheese biscuits with a crisp finish.",
    price: 380,
    stock_quantity: 40,
    image_url: "/images/biscuits/cheese-bits.jpg",
  },
  {
    id: 64,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Butter Cookies",
    description: "Sweet buttery cookies with a rich, melt-in-the-mouth crunch.",
    price: 620,
    stock_quantity: 44,
    image_url: "/images/biscuits/butter-cookies.jpg",
  },
  {
    id: 53,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Chocolate Chip Cookies",
    description: "Crunchy biscuits dotted with generous chocolate chips.",
    price: 750,
    stock_quantity: 45,
    image_url: "/images/sweets/chocolate-chip-cookies.jpg",
  },
  {
    id: 65,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Ritzbury Chocolate Fingers",
    description: "Chocolate-coated wafer fingers for a crisp sweet treat.",
    price: 520,
    stock_quantity: 42,
    image_url: "/images/sweets/ritzbury-chocolate-fingers.jpg",
  },
  {
    id: 66,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Ritzbury Pebbles",
    description: "Colorful candy-coated chocolate pieces.",
    price: 280,
    stock_quantity: 55,
    image_url: "/images/sweets/ritzbury-pebbles.jpg",
  },
  {
    id: 67,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Ritzbury Choco Mo",
    description: "Soft chocolate snack with a creamy cocoa bite.",
    price: 240,
    stock_quantity: 50,
    image_url: "/images/sweets/ritzbury-choco-mo.jpg",
  },
  {
    id: 68,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Chunky Choc",
    description: "Chocolate-coated wafer bars with a chunky cocoa crunch.",
    price: 380,
    stock_quantity: 46,
    image_url: "/images/sweets/chunky-choc.jpg",
  },
  {
    id: 69,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "KitKat",
    description: "Crisp wafer fingers covered in smooth milk chocolate.",
    price: 450,
    stock_quantity: 48,
    image_url: "/images/sweets/kitkat.jpg",
  },
  {
    id: 70,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Milk Toffee",
    description: "Traditional creamy milk toffee with a rich caramel flavor.",
    price: 180,
    stock_quantity: 60,
    image_url: "/images/sweets/milk-toffee.jpg",
  },
  {
    id: 71,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Coconut Toffee",
    description: "Sweet coconut toffee pieces with a chewy texture.",
    price: 180,
    stock_quantity: 58,
    image_url: "/images/sweets/coconut-toffee.jpg",
  },
  {
    id: 72,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Unduwal",
    description: "Traditional sweet rings made for festive snacking.",
    price: 260,
    stock_quantity: 35,
    image_url: "/images/sweets/unduwal.jpg",
  },
  {
    id: 73,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Sweets",
    name: "Lollipops",
    description: "Assorted fruity lollipops for a fun sweet treat.",
    price: 120,
    stock_quantity: 80,
    image_url: "/images/sweets/lollipops.jpg",
  },
  {
    id: 54,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Beverages",
    name: "Red Bull",
    description: "Classic energy drink with a bold, refreshing taste.",
    price: 650,
    stock_quantity: 34,
    image_url: "/images/beverages/red-bull.jpeg",
  },
  {
    id: 74,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Beverages",
    name: "Elephant House Cream Soda",
    description: "Classic Sri Lankan cream soda served chilled.",
    price: 220,
    stock_quantity: 48,
    image_url: "/images/beverages/cream-soda.jpeg",
  },
  {
    id: 75,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Beverages",
    name: "Coca-Cola",
    description: "Refreshing cola drink for meals and snacks.",
    price: 240,
    stock_quantity: 55,
    image_url: "/images/beverages/coca-cola.jpeg",
  },
  {
    id: 76,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Beverages",
    name: "Sprite",
    description: "Crisp lemon-lime soft drink served cold.",
    price: 240,
    stock_quantity: 52,
    image_url: "/images/beverages/sprite.jpeg",
  },
  {
    id: 77,
    category_id: 6,
    category_name: "Sweets & Beverages",
    subcategory: "Beverages",
    name: "MD Mixed Fruit Nectar",
    description: "Thick mixed fruit nectar with a sweet tropical taste.",
    price: 360,
    stock_quantity: 36,
    image_url: "/images/beverages/md-mixed-fruit-nectar.jpeg",
  },
];
const departmentNames = [
  "Vegetables",
  "Fruits",
  "Meat & Seafood",
  "Bakery Items",
  "Dairy Items",
  "Sweets & Beverages",
];
const starterCategories = departmentNames.map((name, index) => ({
  id: index + 1,
  name,
}));
const bakerySubcategories = ["Cakes", "Bread", "Pastries", "Buns"];
const dairySubcategories = ["Dairy Products", "Ice Cream"];
const sweetsBeveragesSubcategories = ["Biscuits", "Sweets", "Beverages"];

function getSubcategoryOptions(categoryName) {
  if (categoryName === "Bakery Items") {
    return {
      ariaLabel: "Bakery subcategories",
      label: "Bakery type",
      allLabel: "All Bakery",
      options: bakerySubcategories,
    };
  }
  if (categoryName === "Sweets & Beverages") {
    return {
      ariaLabel: "Sweets and beverages subcategories",
      label: "Sweets type",
      allLabel: "All Sweets",
      options: sweetsBeveragesSubcategories,
    };
  }
  if (categoryName === "Dairy Items") {
    return {
      ariaLabel: "Dairy subcategories",
      label: "Dairy type",
      allLabel: "All Dairy",
      options: dairySubcategories,
    };
  }
  return null;
}

function sortDepartments(categoryList) {
  return [...categoryList].sort((first, second) => {
    const firstPosition = departmentNames.indexOf(first.name);
    const secondPosition = departmentNames.indexOf(second.name);
    const firstOrder =
      firstPosition === -1 ? departmentNames.length : firstPosition;
    const secondOrder =
      secondPosition === -1 ? departmentNames.length : secondPosition;
    return firstOrder - secondOrder || first.name.localeCompare(second.name);
  });
}

export default function Products() {
  const { syncError } = useCart();
  const [products, setProducts] = useState(starterProducts);
  const [categories, setCategories] = useState(starterCategories);
  const [activeCategory, setActiveCategory] = useState(
    String(starterCategories[0]?.id || ""),
  );
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([catalog, availableCategories]) => {
        const sortedCategories = sortDepartments(availableCategories);
        setProducts(catalog);
        setCategories(sortedCategories);
        setActiveCategory(
          (currentCategory) =>
            currentCategory || String(sortedCategories[0]?.id || ""),
        );
      })
      .catch(() =>
        setNotice(
          "Showing sample products while the store service is offline.",
        ),
      );
  }, []);

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory || String(product.category_id) === activeCategory;
    const matchesSubcategory =
      !activeSubcategory || product.subcategory === activeSubcategory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    return matchesCategory && matchesSubcategory && matchesSearch;
  });
  const activeCategoryName = categories.find(
    (category) => String(category.id) === activeCategory,
  )?.name;
  const subcategoryOptions = getSubcategoryOptions(activeCategoryName);
  const discountProducts = products.filter(hasDiscount).slice(0, 4);

  const showDiscountProduct = (product) => {
    setActiveCategory(String(product.category_id || ""));
    setActiveSubcategory(product.subcategory || "");
    setSearchTerm(product.name);
  };

  return (
    <section className="catalog-page">
      <header className="section-header">
        <h1>The daily market</h1>
        <p>
          Choose from fresh produce, seafood, bakery, dairy, sweets, and
          beverages.
        </p>
      </header>
      {notice && <p className="notice">{notice}</p>}
      {syncError && <p className="stock-alert">{syncError}</p>}
      <div className="catalog-tools">
        <label className="search-box">
          <span>Search products</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name..."
            value={searchTerm}
          />
        </label>
        <div className="category-filters" aria-label="Product categories">
          {categories.map((category) => (
            <button
              className={activeCategory === String(category.id) ? "active" : ""}
              key={category.id}
              onClick={() => {
                setActiveCategory(String(category.id));
                setActiveSubcategory("");
              }}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
        {subcategoryOptions && (
          <div
            className="subcategory-filters"
            aria-label={subcategoryOptions.ariaLabel}
          >
            <span>{subcategoryOptions.label}</span>
            <button
              className={!activeSubcategory ? "active" : ""}
              onClick={() => setActiveSubcategory("")}
              type="button"
            >
              {subcategoryOptions.allLabel}
            </button>
            {subcategoryOptions.options.map((subcategory) => (
              <button
                className={activeSubcategory === subcategory ? "active" : ""}
                key={subcategory}
                onClick={() => setActiveSubcategory(subcategory)}
                type="button"
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!visibleProducts.length && (
        <div className="empty-state discount-empty-state">
          <p>
            Try one of today&apos;s discount picks while we restock the shelf.
          </p>
          <div className="discount-grid">
            {discountProducts.length ? (
              discountProducts.map((product) => {
                return (
                  <article className="discount-card" key={product.id}>
                    <span className="discount-badge">
                      {discountPercent(product)}% off
                    </span>
                    <img
                      alt={product.name}
                      src={productImageSrc(product.image_url)}
                    />
                    <div>
                      <small>{product.category_name}</small>
                      <h3>{product.name}</h3>
                      <p>
                        <strong>{formatLkr(salePrice(product))}</strong>
                        <span>{formatLkr(product.price)}</span>
                      </p>
                      <button
                        onClick={() => showDiscountProduct(product)}
                        type="button"
                      >
                        View deal
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="discount-empty-note">
                Add a discount percentage in the admin product form to show
                offers here.
              </p>
            )}
          </div>
          {searchTerm && (
            <button
              className="button secondary"
              onClick={() => setSearchTerm("")}
              type="button"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </section>
  );
}
