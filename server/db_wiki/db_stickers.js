import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const [rows] = await pool.query("SELECT id, name, image, url, rarity FROM stickers");
      return rows;
    },
    addItem: async (data) => {
      const [result] = await pool.execute(
        "INSERT INTO stickers (name, image, url, rarity) VALUES (?, ?, ?, ?)",
        [data.name, data.image, data.url, data.rarity]
      );
      return { success: true, id: result.insertId };
    },
    updateItem: async (id, data) => {
      const [result] = await pool.execute(
        "UPDATE stickers SET name = ?, image = ?, url = ?, rarity = ? WHERE id = ?",
        [data.name, data.image, data.url, data.rarity, id]
      );
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
    deleteItem: async (id) => {
      const [result] = await pool.execute("DELETE FROM stickers WHERE id = ?", [id]);
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
  };

  return db;
};

export { createDB };
