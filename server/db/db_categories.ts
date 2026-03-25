import { pool } from "./db_connections.js";
import type { RowDataPacket,ResultSetHeader } from "mysql2/promise";
import { CategoriesDb } from "../types/db.js";
import { Category } from "../types/models.js";

let db: CategoriesDb | undefined;

const createDB = async () => {
    if (db) return db;

    db = {
        getAllCategories: async () => {
            const [rows] = await pool!.query<RowDataPacket[]>("SELECT * FROM categories ORDER BY sort_order, id");
            return rows as Category[];
        },

        addCategory: async (id, newCategory) => {
            const sql =
                "INSERT INTO categories (id, display_name, is_visible, is_tradeable, is_favoritable, sort_order) VALUES (?, ?, ?, ?, ?, ?)";
            await pool!.execute(sql, [
                id,
                newCategory.display_name,
                newCategory.is_visible,
                newCategory.is_tradeable,
                newCategory.is_favoritable,
                newCategory.sort_order,
            ]);
        },

        updateCategory: async (id, newCategory) => {
            const sql =
                "UPDATE categories SET display_name=?, is_visible=?, is_tradeable=?, is_favoritable=?, sort_order=? WHERE id=?";
            await pool!.execute(sql, [
                newCategory.display_name,
                newCategory.is_visible,
                newCategory.is_tradeable,
                newCategory.is_favoritable,
                newCategory.sort_order,
                id,
            ]);
        },

        patchCategory: async (id, data) => {
            const ALLOWED = ["display_name", "is_visible", "is_tradeable", "is_favoritable", "sort_order"];

            const fields = Object.keys(data).filter((f) => ALLOWED.includes(f));
            if (fields.length === 0) return { success: false, error: "No valid fields provided" };

            const setClause = fields.map((f) => `${f} = ?`).join(", ");
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
