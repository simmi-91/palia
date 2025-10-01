import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { pool } from "./db_connections.js";

let db;
if (process.env.DB_HOST) {
  db = {
    getAllLinks: async () => {
      const [rows] = await pool.query("SELECT * FROM links");
      return rows;
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
} else {
  console.log("Using LowDB for local development.");

  const adapterLinks = new JSONFile("../json_db/links.json");
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
}
export default db;
