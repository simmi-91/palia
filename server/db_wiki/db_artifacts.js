import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const [rows] = await pool.query("SELECT id, name, image, url FROM artifacts");
      return rows;
    },
    addItem: async (data) => {
      const [result] = await pool.execute(
        "INSERT INTO artifacts (name, image, url) VALUES (?, ?, ?)",
        [data.name, data.image, data.url]
      );
      return { success: true, id: result.insertId };
    },
    updateItem: async (id, data) => {
      const [result] = await pool.execute(
        "UPDATE artifacts SET name = ?, image = ?, url = ? WHERE id = ?",
        [data.name, data.image, data.url, id]
      );
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
    deleteItem: async (id) => {
      const [result] = await pool.execute("DELETE FROM artifacts WHERE id = ?", [id]);
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
  };

  return db;
};

export { createDB };
