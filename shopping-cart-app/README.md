# ShopNest Shopping Cart App

A starter full-stack shopping cart application with a React/Vite frontend,
Node.js/Express API, and MySQL database.

## Project Structure

- `frontend/` contains pages for home, products, cart, login, registration,
  checkout order summary, and the admin dashboard.
- `backend/` contains REST routes, controllers, services, models, and
  authentication middleware.
- `database/` contains schema and starter product data.
- `docs/` contains the editable API reference and locations for final exports.

## Setup

1. Start XAMPP MySQL, then create the tables by running
   `database/shopping_cart.sql`, followed by `database/seed_data.sql` in
   phpMyAdmin or the XAMPP MySQL client.
2. Update `backend/.env` for the local MySQL credentials and choose a secure
   `JWT_SECRET`.
3. In `backend`, run `npm install` and `npm run dev`.
4. In `frontend`, run `npm install` and `npm run dev`.

From the parent `Shoppingcart Web app` directory, you can instead run
`npm run dev` for the frontend and `npm run backend` for the API.

The frontend runs at `http://localhost:5173` and expects the API at
`http://localhost:5000/api`.

## Features

- Grocery and bakery browsing across Vegetables, Fruits, Cakes, and Biscuits.
- Search and category filtering, cart quantity management, and order summary checkout.
- Customer registration/login with MySQL-backed saved carts.
- Administrator catalog management for products and categories.

## Admin Access

Registered accounts begin with the `customer` role. Promote an account for
local administration through MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Then sign in through `/admin/login`.

Google, Facebook, and passkey authentication are included. Add provider
credentials in `backend/.env` and matching frontend client IDs in
`frontend/.env` before using social login:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

For Facebook, add `http://localhost:5173/facebook-auth.html` as a valid OAuth
redirect URI in the Meta app settings. For Google, add `http://localhost:5173`
as an authorized JavaScript origin.
