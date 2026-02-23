import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/artifacts.json");
      const lowdb = new Low(adapter, []);

      await lowdb.read();
      db = {
        getAll: async () => {
          await lowdb.read();
          return lowdb.data;
        },
        updateItem: async (id, data) => {
          await lowdb.read();
          const index = lowdb.data.findIndex((item) => item.id === id);
          if (index === -1) return { success: false, error: "Not found" };
          lowdb.data[index] = { ...lowdb.data[index], ...data, id };
          await lowdb.write();
          return { success: true };
        },
      };
    } else {
      const sql = `SELECT id, name, image, url FROM artifacts`;
      const pool = initializePool();
      db = {
        getAll: async () => {
          const [rows] = await pool.query(sql);
          return rows;
        },
        updateItem: async () => {
          return { success: false, error: "Update not yet implemented for MySQL" };
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
