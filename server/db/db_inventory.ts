import { pool } from "./db_connections.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { InventoryDb, RawInventoryRow, RawTradeableRow } from "../types/db.js";

let db : InventoryDb | undefined;

const createDB = async () => {
    if (db) return db;

    db = {
        getAll: async (profileId) => {
            const [rows] = await pool!.query<RowDataPacket[]>(
                "SELECT category, item_id, amount FROM user_inventory WHERE user_id = ?",
                [profileId]
            );
            return (rows as RawInventoryRow[]).map((item) => ({
                category: item.category,
                itemId: item.item_id,
                amount: item.amount,
            }));
        },

        update: async (profileId, category, itemId, amount) => {
            const sql = `
                INSERT INTO user_inventory (user_id, category, item_id, amount)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE amount = VALUES(amount)
            `;
            const [result] = await pool!.execute<ResultSetHeader>(sql, [profileId, category, itemId, amount]);
            return { success: true, count: result.affectedRows };
        },

        bulkUpdate: async (profileId, items) => {
            const placeholders: string[] = [];
            const values: (string|number)[] = [];

            items.forEach((item) => {
                placeholders.push("(?, ?, ?, ?)");
                values.push(profileId, item.category, item.itemId, item.amount);
            });

            const sql = `
                INSERT INTO user_inventory (user_id, category, item_id, amount)
                VALUES ${placeholders.join(", ")}
                ON DUPLICATE KEY UPDATE amount = VALUES(amount)
            `;
            const [result] = await pool!.execute<ResultSetHeader>(sql, values);
            return { success: true, count: result.affectedRows };
        },

        getTradeable: async (profileId) => {
            const [rows] = await pool!.query<RowDataPacket[]>(`
                SELECT ui.user_id, u.given_name, ui.category, ui.item_id, GREATEST(ui.amount - 1, 0) AS amount
                FROM user_inventory ui
                JOIN users u ON ui.user_id = u.google_id
                WHERE ui.user_id != ? AND ui.amount > 1
            `,
                [profileId]
            );
            return (rows as RawTradeableRow[]).map((item) => ({
                userId: item.user_id,
                userName: item.given_name,
                category: item.category,
                itemId: item.item_id,
                amount: item.amount,
            }));
        },
    };

    return db;
};

export { createDB };
