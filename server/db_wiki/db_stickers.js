import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const [rows] = await pool.query("SELECT id, name, image, url, rarity FROM stickers");
      return rows;
    },
    updateItem: async () => {
      return { success: false, error: "Update not yet implemented for MySQL" };
    },
  };

  return db;
};

export { createDB };
