import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/stickers.json");
      const lowdb = new Low(adapter, []);

      await lowdb.read();
      db = {
        getAll: async () => {
          await lowdb.read();
          return lowdb.data;
        },
      };
    } else {
      const sql = `SELECT id, name, image, url, rarity FROM stickers`;
      const pool = initializePool();
      db = {
        getAll: async () => {
          const [rows] = await pool.query(sql);
          return rows;
        },
      };
    }
  } else {
    // found no host
    throw new Error("Database host not initialized or found.");
  }
  return db;
};

export { createDB };
