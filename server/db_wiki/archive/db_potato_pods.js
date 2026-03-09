import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const [rows] = await pool.query("SELECT id, name, image, url, family FROM potato_pods");
      return rows;
    },
    addItem: async (data) => {
      const [result] = await pool.execute(
        "INSERT INTO potato_pods (name, image, url, family) VALUES (?, ?, ?, ?)",
        [data.name, data.image, data.url, data.family]
      );
      return { success: true, id: result.insertId };
    },
    updateItem: async (id, data) => {
      const [result] = await pool.execute(
        "UPDATE potato_pods SET name = ?, image = ?, url = ?, family = ? WHERE id = ?",
        [data.name, data.image, data.url, data.family, id]
      );
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
    deleteItem: async (id) => {
      const [result] = await pool.execute("DELETE FROM potato_pods WHERE id = ?", [id]);
      if (!result.affectedRows) return { success: false, error: "Not found" };
      return { success: true };
    },
    getFamilies: async () => {
      const [rows] = await pool.query("SELECT DISTINCT family FROM potato_pods WHERE family IS NOT NULL AND family != '' ORDER BY family");
      return rows.map((r) => r.family);
    },
  };

  return db;
};

export { createDB };
