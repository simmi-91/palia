import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const sql = `
        SELECT
            p.id, p.image, p.name, p.url, p.rarity,
            COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', e.title, 'url', e.url, 'category', e.category)), '[]') AS howToObtain
        FROM plushies p
        LEFT JOIN plushies_how_to_obtain_link l ON p.id = l.plushies_id
        LEFT JOIN how_to_obtain_entity e ON l.how_to_obtain_id = e.id
        GROUP BY p.id, p.image, p.name, p.url, p.rarity
        ORDER BY p.id
      `;
      const [rows] = await pool.query(sql);
      return rows.map((row) => ({
        ...row,
        howToObtain: JSON.parse(row.howToObtain),
      }));
    },
    updateItem: async () => {
      return { success: false, error: "Update not yet implemented for MySQL" };
    },
  };

  return db;
};

export { createDB };
