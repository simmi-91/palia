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
        getAll: async (user_id) => {
          await lowdb.read();
          const items = lowdb.data || [];
          if (!user_id) return items;
          return items.filter((f) => String(f.user_id) == String(user_id));
        },
        addFavorite: async (newFavorite) => {
          await lowdb.read();

          const items = lowdb.data || [];
          const newId =
            items.length > 0 ? Math.max(...items.map((l) => l.id || 0)) + 1 : 1;
          items.push({
            favorite_id: newId,
            user_id: newFavorite.user_id,
            category: newFavorite.category,
            item_id: newFavorite.item_id,
          });
          await lowdb.write();
        },
        removeFavorite: async (favorite_id, user_id) => {
          await lowdb.read();
          const items = lowdb.data || [];
          const index = items.findIndex(
            (f) =>
              String(f.favorite_id) == String(favorite_id) &&
              String(f.user_id) == String(user_id)
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
        getAll: async (user_id) => {
          const [rows] = await pool.query(
            "SELECT * FROM user_favorites WHERE user_id=?",
            [user_id]
          );
          return rows;
        },
        addFavorite: async (newFavorite) => {
          const sql =
            "INSERT INTO user_favorites (user_id,category,item_id) VALUES (?, ?, ?)";
          const values = [
            newFavorite.user_id,
            newFavorite.category,
            newFavorite.item_id,
          ];
          await pool.execute(sql, values);
        },
        removeFavorite: async (favorite_id, user_id) => {
          const sql =
            "DELETE FROM user_favorites WHERE favorite_id=? AND user_id=? ";
          const values = [favorite_id, user_id];
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
