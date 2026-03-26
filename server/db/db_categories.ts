import { pool } from "./db_connections.js";
import type { RowDataPacket,ResultSetHeader } from "mysql2/promise";
import { CategoriesDb } from "../types/db.js";
import { Category } from "../types/models.js";

let db: CategoriesDb | undefined;

// Maps camelCase TypeScript keys to snake_case DB column names
const FIELD_MAP: Record<string, string> = {
    displayName: "display_name",
    isVisible: "is_visible",
    isTradeable: "is_tradeable",
    isFavoritable: "is_favoritable",
    sortOrder: "sort_order",
};

const createDB = async () => {
    if (db) return db;

    db = {
        getAllCategories: async () => {
            const sql = `SELECT id,
                display_name AS displayName,
                is_visible AS isVisible,
                is_tradeable AS isTradeable,
                is_favoritable AS isFavoritable,
                sort_order AS sortOrder
                FROM categories ORDER BY sort_order, id`;
            const [rows] = await pool!.query<RowDataPacket[]>(sql);
            return rows as Category[];
        },

        addCategory: async (id, newCategory) => {
            const sql =
                "INSERT INTO categories (id, display_name, is_visible, is_tradeable, is_favoritable, sort_order) VALUES (?, ?, ?, ?, ?, ?)";
            await pool!.execute(sql, [
                id,
                newCategory.displayName,
                newCategory.isVisible,
                newCategory.isTradeable,
                newCategory.isFavoritable,
                newCategory.sortOrder,
            ]);
        },

        updateCategory: async (id, newCategory) => {
            const sql =
                "UPDATE categories SET display_name=?, is_visible=?, is_tradeable=?, is_favoritable=?, sort_order=? WHERE id=?";
            await pool!.execute(sql, [
                newCategory.displayName,
                newCategory.isVisible,
                newCategory.isTradeable,
                newCategory.isFavoritable,
                newCategory.sortOrder,
                id,
            ]);
        },

        patchCategory: async (id, data) => {
            const fields = Object.keys(data).filter((f) => f in FIELD_MAP);
            if (fields.length === 0) return { success: false, error: "No valid fields provided" };

            const setClause = fields.map((f) => `${FIELD_MAP[f]} = ?`).join(", ");
            const values = [...fields.map((f) => (data as Record<string, unknown>)[f]), id];

            const [result] = await pool!.execute<ResultSetHeader>(
                `UPDATE categories SET ${setClause} WHERE id = ?`,
                values
            );
            if (!result.affectedRows) return { success: false, error: "Not found" };
            return { success: true };
        },

        deleteCategory: async (id) => {
            const sql = "DELETE FROM categories WHERE id = ?";
            await pool!.execute(sql, [id]);
            return { success: true };
        },
    };

    return db;
};

export { createDB };
