import { pool } from "./db_connections.js";
import type { RowDataPacket,ResultSetHeader } from "mysql2/promise";
import type { EntityType, EntityLink,DbResultWithId } from "../types/models.ts";
import type { EntityDb } from "../types/db.js";

const allowedEntities = new Set(["location_entity", "needed_for_entity", "how_to_obtain_entity"]);
const ensureAllowedEntity = (entity:EntityType) => {
    if (!allowedEntities.has(entity)) {
        throw new Error(`Disallowed entity/table: ${entity}`);
    }
};

let db: EntityDb | undefined;

const createDB = async () => {
    if (db) return db;

    db = {
        getAllEntities: async (entity) => {
            ensureAllowedEntity(entity);
            const [rows] = await pool!.query<RowDataPacket[]>(
                `SELECT id, title, url, category FROM \`${entity}\` ORDER BY category DESC, title ASC`
            );
            return rows as EntityLink[];
        },

        addEntity: async (entity, newItem) => {
            ensureAllowedEntity(entity);
            const sql = `INSERT INTO \`${entity}\` (title, url, category) VALUES (?, ?, ?)`;
            const [result] = await pool!.execute<ResultSetHeader>(sql, [
                newItem.title,
                newItem.url,
                newItem.category,
            ]);
            return { success: true, id: result?.insertId } as DbResultWithId;
        },

        updateEntitiy: async (entity: EntityType, id: number, newItem: EntityLink) => {
            ensureAllowedEntity(entity);
            const fields = [];
            const values = [];
            if (newItem.title !== undefined) {
                fields.push("title = ?");
                values.push(newItem.title);
            }
            if (newItem.url !== undefined) {
                fields.push("url = ?");
                values.push(newItem.url);
            }
            if (newItem.category !== undefined) {
                fields.push("category = ?");
                values.push(newItem.category);
            }
            if (fields.length === 0) return { success: true, id };
            values.push(id);
            const sql = `UPDATE \`${entity}\` SET ${fields.join(", ")} WHERE id = ?`;
            const [result] = await pool!.execute<ResultSetHeader>(sql, values);
            if (!(result?.affectedRows ?? 0)) return { success: false, id, error: "Not found" };
            return { success: true, id };
        },

        deleteEntitiy: async (entity: EntityType, id: number) => {
            ensureAllowedEntity(entity);
            const sql = `DELETE FROM \`${entity}\` WHERE id = ?`;
            const [result] = await pool!.execute<ResultSetHeader>(sql, [id]);
            if (!(result?.affectedRows ?? 0)) return { success: false, id, error: "Not found" };
            return { success: true, id };
        },
    };

    return db;
};

export { createDB };
