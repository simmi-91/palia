import { pool } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAllLinks: async () => {
      const [rows] = await pool.query("SELECT * FROM links");
      return rows;
    },

    addLink: async (newLink) => {
      const sql = "INSERT INTO links (site, url, logo, description) VALUES (?, ?, ?, ?)";
      await pool.execute(sql, [newLink.site, newLink.url, newLink.logo, newLink.description]);
    },
  };

  return db;
};

export { createDB };
