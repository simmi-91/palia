import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/plushies.json");
      const lowdb = new Low(adapter, []);

      await lowdb.read();
      db = {
        getAll: async () => {
          await lowdb.read();
          return lowdb.data;
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getAll: async () => {
          const sql = `
            SELECT
                p.id,
                p.image,
                p.name,
                p.url,
                p.rarity,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'title', e.title,
                            'url', e.url,
                            'category', e.category
                        )
                    ),
                    '[]' 
                ) AS howToObtain
            FROM
                plushies p
            LEFT JOIN
                plushies_how_to_obtain_link l ON p.id = l.plushies_id
            LEFT JOIN
                how_to_obtain_entity e ON l.how_to_obtain_id = e.id
            GROUP BY
                p.id, p.image, p.name, p.url, p.rarity
            ORDER BY
                p.id
            `;

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
