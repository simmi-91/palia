import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapterLinks = new JSONFile("json_db/links.json");
      const lowdb = new Low(adapterLinks, { links: [] });

      await lowdb.read();
      db = {
        getAllLinks: async () => {
          await lowdb.read();
          return lowdb.data;
        },
        addLink: async (newLink) => {
          await lowdb.read();

          const links = lowdb.data.links;
          const newId =
            links.length > 0 ? Math.max(...links.map((l) => l.id || 0)) + 1 : 1;
          links.push({
            id: newId,
            site: newLink.site,
            url: newLink.url,
            logo: newLink.logo,
            description: newLink.description,
          });
          await lowdb.write();
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getAllLinks: async () => {
          const [rows] = await pool.query("SELECT * FROM links");
          return { links: rows };
        },
        addLink: async (newLink) => {
          const sql =
            "INSERT INTO links (site, url, logo, description) VALUES (?, ?, ?, ?)";
          const values = [
            newLink.site,
            newLink.url,
            newLink.logo,
            newLink.description,
          ];
          await pool.execute(sql, values);
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
