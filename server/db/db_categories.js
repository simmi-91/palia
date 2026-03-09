import { pool } from "./db_connections.js";

let db;
const createDB = async () => {
    if (db) return db;

    db = {
        getAllCategories: async () => {
            const [rows] = await pool.query("SELECT * FROM categories");
            return rows;
        },

        addCategory: async (id, newCategory) => {
            const sql =
                "INSERT INTO categories (id, display_name, is_visible, is_tradeable, is_favoritable) VALUES (?, ?, ?, ?, ?)";
            await pool.execute(sql, [
                id,
                newCategory.display_name,
                newCategory.is_visible,
                newCategory.is_tradeable,
                newCategory.is_favoritable,
            ]);
        },

        updateCategory: async (id, newCategory) => {
            const sql =
                "UPDATE categories set display_name=?, is_visible=?, is_tradeable=?, is_favoritable=? WHERE id=?";
            await pool.execute(sql, [
                newCategory.display_name,
                newCategory.is_visible,
                newCategory.is_tradeable,
                newCategory.is_favoritable,
                id,
            ]);
        },

        patchCategory: async (id, data) => {
            const ALLOWED = ["display_name", "is_visible", "is_tradeable", "is_favoritable"];
            const fields = Object.keys(data).filter((f) => ALLOWED.includes(f));
            if (fields.length === 0) return { success: false, error: "No valid fields provided" };

            const setClause = fields.map((f) => `${f} = ?`).join(", ");
            const values = [...fields.map((f) => data[f]), id];
            const [result] = await pool.execute(
                `UPDATE categories SET ${setClause} WHERE id = ?`,
                values
            );
            if (!result.affectedRows) return { success: false, error: "Not found" };
            return { success: true };
        },

        deleteCategory: async (id) => {
            const sql = "DELETE FROM categories WHERE id = ?";
            await pool.execute(sql, [id]);
        },
    };

    return db;
};

export { createDB };
