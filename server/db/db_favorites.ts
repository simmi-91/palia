import { pool } from "./db_connections.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { FavoritesDb, RawFavoriteRow } from "../types/db.js";

let db: FavoritesDb | undefined;

const createDB = async () => {
    if (db) return db;

    db = {
        getAll: async (userId) => {
            const [rows] = await pool!.query<RowDataPacket[]>("SELECT * FROM user_favorites WHERE user_id = ?", [
                userId,
            ]);
            return (rows as RawFavoriteRow[]).map((item) => ({
                favoriteId: item.favorite_id,
                userId: item.user_id,
                itemId: item.item_id,
                category: item.category,
            }));
        },

        addFavorite: async (newFavorite) => {
            const sql = "INSERT INTO user_favorites (user_id, category, item_id) VALUES (?, ?, ?)";

            const [result] = await pool!.execute<ResultSetHeader>(sql, [newFavorite.profileId, newFavorite.category, newFavorite.itemId]);
            return { favoriteId: result.insertId, userId: newFavorite.profileId, category: newFavorite.category, itemId: newFavorite.itemId };
        },

        removeFavorite: async (favoriteId, userId) => {
            const sql = "DELETE FROM user_favorites WHERE favorite_id = ? AND user_id = ?";
            const [result] = await pool!.execute<ResultSetHeader>(sql, [favoriteId, userId]);
            return { removed: (result?.affectedRows ?? 0) > 0 };
        },
    };

    return db;
};

export { createDB };
