import { pool } from "./db_connections.js";
import type { RowDataPacket } from "mysql2/promise";
import type { Link } from "../types/models.js";
import type { LinksDb } from "../types/db.js";

let db: LinksDb | undefined;

const createDB = async () => {
  if (db) return db;

  db = {
    getAllLinks: async () => {
      const [rows] = await pool!.query<RowDataPacket[]>("SELECT * FROM links");
      return rows as Link[];
    },

    addLink: async (newLink) => {
      const sql = "INSERT INTO links (site, url, logo, description) VALUES (?, ?, ?, ?)";
      await pool!.execute(sql, [newLink.site, newLink.url, newLink.logo, newLink.description]);
    },
  };

  return db;
};

export { createDB };
