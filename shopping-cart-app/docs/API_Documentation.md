# ShopNest API

Base URL: `http://localhost:5000/api`

## Public Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | API health response |
| POST | `/auth/register` | Register a customer and return a JWT session |
| POST | `/auth/login` | Customer login |
| POST | `/auth/admin/login` | Administrator-only login |
| POST | `/auth/google` | Google login with an ID token |
| POST | `/auth/facebook` | Facebook login with an access token |
| POST | `/auth/passkey/login/options` | Create passkey login options |
| POST | `/auth/passkey/login/verify` | Verify passkey login and return a JWT session |
| GET | `/products` | List products; accepts `categoryId` and `search` query parameters |
| GET | `/products/:id` | Fetch one product |
| GET | `/categories` | List product categories |

## Authenticated Routes

Send `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/cart` | Get the current user's saved cart |
| POST | `/cart` | Save an in-stock item quantity: `{ "productId": 1, "quantity": 2 }` |
| DELETE | `/cart/:productId` | Remove an item from the cart |
| DELETE | `/cart` | Clear the cart |
| GET | `/checkout/summary` | Return server-calculated item count, subtotal, shipping and total |
| POST | `/auth/passkey/register/options` | Create passkey registration options |
| POST | `/auth/passkey/register/verify` | Verify and save a new passkey |

## Administrator Routes

These routes require an authenticated token with role `admin`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| POST | `/categories` | Create a category |
| PUT | `/categories/:id` | Rename a category |
| DELETE | `/categories/:id` | Delete a category; assigned products become uncategorized |

## Implementation Notes

- Passwords are stored as bcrypt hashes and login returns a seven-day JWT.
- Product cart quantities are validated against current stock.
- Payment processing is future scope; checkout currently supplies an order summary.
- Google and Facebook authentication require external provider configuration.
- Passkey authentication uses WebAuthn and works on secure origins, including localhost.
