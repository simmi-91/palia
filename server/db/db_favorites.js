import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapterLinks = new JSONFile("json_db/favorites.json");
      const lowdb = new Low(adapterLinks, []);

      await lowdb.read();
      db = {
        getAll: async (userId) => {
          await lowdb.read();
          const items = lowdb.data || [];
          if (!userId) return items;
          return items.filter((f) => String(f.userId) == String(userId));
        },
        addFavorite: async (newFavorite) => {
          await lowdb.read();

          const items = lowdb.data || [];
          const newId =
            items.length > 0
              ? Math.max(
                  ...items.map((l) => (l.favoriteId != null ? l.favoriteId : 0))
                ) + 1
              : 1;
          const userId =
            newFavorite.userId != null
              ? newFavorite.userId
              : newFavorite.profileId;
          const itemId =
            newFavorite.item_id != null
              ? newFavorite.item_id
              : newFavorite.itemId;
          const created = {
            favoriteId: newId,
            userId: userId,
            category: newFavorite.category,
            itemId: itemId,
          };
          items.push(created);
          await lowdb.write();
          return created;
        },
        removeFavorite: async (favoriteId, userId) => {
          await lowdb.read();
          const items = lowdb.data || [];
          const index = items.findIndex(
            (f) =>
              String(f.favoriteId) == String(favoriteId) &&
              String(f.userId) == String(userId)
          );
          if (index !== -1) {
            items.splice(index, 1);
            await lowdb.write();
          }
          return { removed: index !== -1 };
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getAll: async (userId) => {
          const [rows] = await pool.query(
            "SELECT * FROM user_favorites WHERE user_id=?",
            [userId]
          );

          const frontendFormat = rows.map((item) => ({
            favoriteId: item.favorite_id,
            userId: item.user_id,
            itemId: item.item_id,
            category: item.category,
          }));
          return frontendFormat;
        },
        addFavorite: async (newFavorite) => {
          const sql =
            "INSERT INTO user_favorites (user_id,category,item_id) VALUES (?, ?, ?)";
          const userId =
            newFavorite.user_id != null
              ? newFavorite.user_id
              : newFavorite.profileId;
          const itemId =
            newFavorite.item_id != null
              ? newFavorite.item_id
              : newFavorite.itemId;
          const values = [userId, newFavorite.category, itemId];
          const [result] = await pool.execute(sql, values);
          return {
            favoriteId: result?.insertId,
            userId: userId,
            category: newFavorite.category,
            itemId: itemId,
          };
        },
        removeFavorite: async (favoriteId, userId) => {
          const sql =
            "DELETE FROM user_favorites WHERE favorite_id=? AND user_id=? ";
          const values = [favoriteId, userId];
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
