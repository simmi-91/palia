import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/bugs.json");
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
                b.id,
                b.image,
                b.name,
                b.url,
                b.description,
                b.rarity,
                b.time,
                b.behavior,
                b.baseValue,
                (
                    SELECT 
                        COALESCE(
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'title', le.title,
                                    'url', le.url,
                                    'category', le.category
                                )
                            ),
                            '[]' 
                        )
                    FROM 
                        bugs_location_link AS l_link
                    LEFT JOIN 
                        location_entity AS le ON l_link.location_id = le.id
                    WHERE 
                        l_link.bugs_id = b.id
                ) AS location,
                (
                    SELECT 
                        COALESCE(
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'title', ne.title,
                                    'url', ne.url,
                                    'category', ne.category
                                )
                            ),
                            '[]'
                        )
                    FROM 
                        bugs_needed_for_link AS n_link
                    LEFT JOIN 
                        needed_for_entity AS ne ON n_link.needed_for_id = ne.id
                    WHERE 
                        n_link.bugs_id = b.id
                ) AS neededFor
            FROM
                bugs AS b
            ORDER BY
                b.id
            `;

          const [rows] = await pool.query(sql);

          return rows.map((row) => ({
            ...row,
            location: JSON.parse(row.location),
            neededFor: JSON.parse(row.neededFor),
          }));
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
