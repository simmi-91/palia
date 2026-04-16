import { pool } from "./db_connections.js";
import type { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";
import type { ItemInput } from "../types/models.js";
import type { ItemsDb, RawItemRow } from "../types/db.js";

let db: ItemsDb | undefined;

const createDB = async () => {
    if (db) return db;

    db = {
        getAll: async () => {
            const sql = `
                SELECT
                    i.id, i.category, i.name, i.image, i.url, i.rarity,
                    i.description, i.time, i.base_value AS baseValue,
                    i.behavior, i.bait, i.family,
                    (SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', le.title, 'url', le.url, 'category', le.category)), '[]')
                FROM item_location_link ll LEFT JOIN location_entity le ON ll.location_id = le.id
                WHERE ll.item_id = i.id) AS location,
                (SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', ne.title, 'url', ne.url, 'category', ne.category)), '[]')
                    FROM item_needed_for_link nl LEFT JOIN needed_for_entity ne ON nl.needed_for_id = ne.id
                    WHERE nl.item_id = i.id) AS neededFor,
                (SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', hoe.title, 'url', hoe.url, 'category', hoe.category)), '[]')
                    FROM item_how_to_obtain_link hl LEFT JOIN how_to_obtain_entity hoe ON hl.how_to_obtain_id = hoe.id
                WHERE hl.item_id = i.id) AS howToObtain
                FROM items i
                ORDER BY i.id
            `;
            const [rows] = await pool!.query<RowDataPacket[]>(sql);

            return (rows as RawItemRow[]).map((row) => ({
                id: row.id,
                category: row.category,
                name: row.name,
                image: row.image ?? undefined,
                url: row.url ?? undefined,
                rarity: row.rarity,
                description: row.description ?? undefined,
                time: row.time ?? undefined,
                baseValue: row.baseValue ?? undefined,
                behavior: row.behavior ?? undefined,
                bait: row.bait ?? undefined,
                family: row.family ?? undefined,
                location: JSON.parse(row.location),
                neededFor: JSON.parse(row.neededFor),
                howToObtain: JSON.parse(row.howToObtain),
            }));
        },

        addItem: async (data) => {
            const conn = await pool!.getConnection();
            await conn.beginTransaction();
            try {
                const [result] = await conn.execute<ResultSetHeader>(
                    `INSERT INTO items (category, name, image, url, rarity, description, time, base_value, behavior, bait, family)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.category,
                        data.name,
                        data.image,
                        data.url,
                        data.rarity ?? 0,
                        data.description ?? null,
                        data.time ?? null,
                        data.baseValue ?? null,
                        data.behavior ?? null,
                        data.bait ?? null,
                        data.family ?? null,
                    ]
                );
                const id = result.insertId;
                await insertLinks(conn, id, data);
                await conn.commit();
                return { success: true, id };
            } catch (err) {
                await conn.rollback();
                return { success: false, error: (err as Error).message };
            } finally {
                conn.release();
            }
        },

        updateItem: async (id, data) => {
            const conn = await pool!.getConnection();
            await conn.beginTransaction();
            try {
                await conn.execute(
                    `UPDATE items SET name = ?, image = ?, url = ?, rarity = ?, description = ?,
                    time = ?, base_value = ?, behavior = ?, bait = ?, family = ? WHERE id = ?`,
                    [
                        data.name,
                        data.image,
                        data.url,
                        data.rarity ?? 0,
                        data.description ?? null,
                        data.time ?? null,
                        data.baseValue ?? null,
                        data.behavior ?? null,
                        data.bait ?? null,
                        data.family ?? null,
                        id,
                    ]
                );
                await conn.execute("DELETE FROM item_location_link WHERE item_id = ?", [id]);
                await conn.execute("DELETE FROM item_needed_for_link WHERE item_id = ?", [id]);
                await conn.execute("DELETE FROM item_how_to_obtain_link WHERE item_id = ?", [id]);
                await insertLinks(conn, id, data);
                await conn.commit();
                return { success: true };
            } catch (err) {
                await conn.rollback();
                return { success: false, error: (err as Error).message };
            } finally {
                conn.release();
            }
        },

        deleteItem: async (id) => {
            const conn = await pool!.getConnection();
            await conn.beginTransaction();
            try {
                await conn.execute("DELETE FROM item_location_link WHERE item_id = ?", [id]);
                await conn.execute("DELETE FROM item_needed_for_link WHERE item_id = ?", [id]);
                await conn.execute("DELETE FROM item_how_to_obtain_link WHERE item_id = ?", [id]);
                const [result] = await conn.execute<ResultSetHeader>("DELETE FROM items WHERE id = ?", [id]);
                await conn.commit();
                if (!result.affectedRows) return { success: false, error: "Not found" };
                return { success: true };
            } catch (err) {
                await conn.rollback();
                return { success: false, error: (err as Error).message };
            } finally {
                conn.release();
            }
        },
    };

    return db;
};

const insertLinks = async (conn: PoolConnection, id: number, data: ItemInput): Promise<void> => {
    for (const loc of data.location ?? []) {
        const [[entity]] = await conn.query<RowDataPacket[]>("SELECT id FROM location_entity WHERE title = ?", [
            loc.title,
        ]);
        if (entity)
            await conn.execute(
                "INSERT INTO item_location_link (item_id, location_id) VALUES (?, ?)",
                [id, entity.id]
            );
    }
    for (const nf of data.neededFor ?? []) {
        const [[entity]] = await conn.query<RowDataPacket[]>("SELECT id FROM needed_for_entity WHERE title = ?", [
            nf.title,
        ]);
        if (entity)
            await conn.execute(
                "INSERT INTO item_needed_for_link (item_id, needed_for_id) VALUES (?, ?)",
                [id, entity.id]
            );
    }
    for (const hto of data.howToObtain ?? []) {
        const [[entity]] = await conn.query<RowDataPacket[]>("SELECT id FROM how_to_obtain_entity WHERE title = ?", [
            hto.title,
        ]);
        if (entity)
            await conn.execute(
                "INSERT INTO item_how_to_obtain_link (item_id, how_to_obtain_id) VALUES (?, ?)",
                [id, entity.id]
            );
    }
};

export { createDB };
