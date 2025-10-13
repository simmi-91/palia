import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/fish.json");
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
                f.id,
                f.image,
                f.name,
                f.url,
                f.description,
                f.rarity,
                f.time,
                f.base_value AS baseValue,
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
                        fish_location_link AS l_link
                    LEFT JOIN 
                        location_entity AS le ON l_link.location_id = le.id
                    WHERE 
                        l_link.fish_id = f.id
                ) AS location,
                (
                    SELECT 
                        COALESCE(
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'title', be.title,
                                    'url', be.url,
                                    'category', be.category
                                )
                            ),
                            '[]'
                        )
                    FROM 
                        fish_bait_link AS b_link
                    LEFT JOIN 
                        bait_entity AS be ON b_link.bait_id = be.id
                    WHERE 
                        b_link.fish_id = f.id
                ) AS bait,
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
                        fish_needed_for_link AS n_link
                    LEFT JOIN 
                        needed_for_entity AS ne ON n_link.needed_for_id = ne.id
                    WHERE 
                        n_link.fish_id = f.id
                ) AS needed_for
            FROM
                fish AS f
            ORDER BY
                f.id
            `;

          const [rows] = await pool.query(sql);

          return rows.map((row) => ({
            ...row,
            location: JSON.parse(row.location),
            needed_for: JSON.parse(row.needed_for),
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
