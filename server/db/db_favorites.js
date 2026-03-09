import { pool } from "./db_connections.js";

let db;
const createDB = async () => {
    if (db) return db;

    db = {
        getAll: async (userId) => {
            const [rows] = await pool.query("SELECT * FROM user_favorites WHERE user_id = ?", [
                userId,
            ]);
            return rows.map((item) => ({
                favoriteId: item.favorite_id,
                userId: item.user_id,
                itemId: item.item_id,
                category: item.category,
            }));
        },

        addFavorite: async (newFavorite) => {
            const sql =
                "INSERT INTO user_favorites (user_id, category, item_id) VALUES (?, ?, ?)";
            const userId =
                newFavorite.user_id != null ? newFavorite.user_id : newFavorite.profileId;
            const itemId = newFavorite.item_id != null ? newFavorite.item_id : newFavorite.itemId;
            const [result] = await pool.execute(sql, [userId, newFavorite.category, itemId]);
            return { favoriteId: result?.insertId, userId, category: newFavorite.category, itemId };
        },

        removeFavorite: async (favoriteId, userId) => {
            const sql = "DELETE FROM user_favorites WHERE favorite_id = ? AND user_id = ?";
            const [result] = await pool.execute(sql, [favoriteId, userId]);
            return { removed: (result?.affectedRows ?? 0) > 0 };
        },
    };

    return db;
};

export { createDB };
