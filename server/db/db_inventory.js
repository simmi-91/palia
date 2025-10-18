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

        bulkUpdate: async (profileId, items) => {
          await lowdb.read();

          const otherUsersInventory = lowdb.data.filter(
            (item) => item.userId !== profileId
          );
          let userInventory = lowdb.data.filter(
            (item) => item.userId === profileId
          );

          const userInventoryMap = new Map();
          userInventory.forEach((item, index) => {
            const key = `${item.category}:${item.itemId}`;
            userInventoryMap.set(key, index);
          });

          items.forEach((newItem) => {
            const key = `${newItem.category}:${newItem.itemId}`;
            const existingIndex = userInventoryMap.get(key);

            if (existingIndex !== undefined) {
              userInventory[existingIndex].amount = newItem.amount;
            } else if (newItem.amount > 0) {
              userInventory.push({
                userId: profileId,
                category: newItem.category,
                itemId: newItem.itemId,
                amount: newItem.amount,
              });
            }
          });

          const updatedUserInventory = userInventory.filter(
            (item) => item.amount > 0
          );
          lowdb.data = [...otherUsersInventory, ...updatedUserInventory];

          await lowdb.write();
          return { success: true, count: items.length };
        },

        getTradeable: async (profileId) => {
          await lowdb.read();
          const inventory = lowdb.data.filter(
            (item) => item.userId !== profileId
          );
          const frontendInventory = inventory.map((item) => ({
            userId: item.userId,
            userName: item.userName,
            category: item.category,
            itemId: item.itemId,
            amount: item.amount,
          }));

          return frontendInventory.filter((item) => item.amount > 0);
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getAll: async (profileId) => {
          const [rows] = await pool.query(
            "SELECT category,item_id,amount FROM user_inventory WHERE user_id = ?",
            [profileId]
          );

          const frontendInventory = rows.map((item) => ({
            category: item.category,
            itemId: item.item_id,
            amount: item.amount,
          }));

          return frontendInventory;
        },

        update: async (profileId, category, itemId, amount) => {
          const sql = `
            INSERT INTO user_inventory (user_id, category, item_id, amount) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                amount = VALUES(amount);
          `;
          const values = [profileId, category, itemId, amount];

          const [result] = await pool.execute(sql, values);
          const insertedOrUpdatedCount =
            result.affectedRows - result.changedRows;
          return { success: true, count: insertedOrUpdatedCount };
        },

        bulkUpdate: async (profileId, items) => {
          const placeholders = [];
          const values = [];
          items.forEach((item) => {
            placeholders.push("(?, ?, ?, ?)");
            values.push(profileId, item.category, item.itemId, item.amount);
          });

          const sql = `
          INSERT INTO user_inventory (user_id, category, item_id, amount) 
          VALUES 
              ${placeholders.join(", ")} 
          ON DUPLICATE KEY UPDATE 
              amount = VALUES(amount);
          `;

          const [result] = await pool.execute(sql, values);
          const insertedOrUpdatedCount =
            result.affectedRows - result.changedRows;
          return { success: true, count: insertedOrUpdatedCount };
        },

        getTradeable: async (profileId) => {
          const [rows] = await pool.query(
            `
            SELECT
                ui.user_id,
                u.given_name,
                ui.category,
                ui.item_id,
                GREATEST(ui.amount - 1, 0) AS amount
            FROM 
                user_inventory ui
            JOIN
                users u ON ui.user_id = u.google_id 
            WHERE 
                ui.user_id != ? 
                AND ui.amount > 1
            `,
            [profileId]
          );

          const frontendInventory = rows.map((item) => ({
            userId: item.user_id,
            userName: item.given_name,
            category: item.category,
            itemId: item.item_id,
            amount: item.amount,
          }));

          return frontendInventory;
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
