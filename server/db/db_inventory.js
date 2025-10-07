import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/inventory.json");
      const lowdb = new Low(adapter, []);

      await lowdb.read();
      db = {
        getAll: async (profileId) => {
          await lowdb.read();
          const inventory = lowdb.data.filter(
            (item) => item.userId === profileId
          );

          const frontendInventory = inventory.map((item) => ({
            category: item.category,
            itemId: item.itemId,
            amount: item.amount,
          }));

          return frontendInventory.filter((item) => item.amount > 0);
        },
        update: async (profileId, category, itemId, amount) => {
          await lowdb.read();

          const index = lowdb.data.findIndex(
            (item) =>
              item.userId === profileId &&
              item.category === category &&
              item.itemId === itemId
          );

          if (index > -1) {
            // Found: Update the amount
            lowdb.data[index].amount = amount;
          } else if (amount > 0) {
            lowdb.data.push({
              userId: profileId,
              category: category,
              itemId: itemId,
              amount: amount,
            });
          }

          await lowdb.write();
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getAll: async (profileId) => {
          const [rows] = await pool.query(
            "SELECT category,item_id,amount FROM user_inventory WHERE email = ?",
            [profileId]
          );
          return rows;
        },
        update: async (profileId, category, itemId, amount) => {
          const sql = `
            INSERT INTO user_inventory (user_id, category, item_id, amount) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                amount = VALUES(amount);
          `;
          const values = [profileId, category, itemId, amount];
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
