import "dotenv/config";
import app from "./app.js";
import { testConnection } from "./config/db.js";

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`ShopNest API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
}

startServer();
