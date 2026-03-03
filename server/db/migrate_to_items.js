/**
 * One-time migration: consolidates all wiki catalog tables into the unified `items` table.
 *
 * Run with:  node server/db/migrate_to_items.js
 *
 * Safe to run multiple times — aborts if `items` already has rows.
 * Does NOT drop old tables. Do that manually after verifying the migration.
 */

import dotenv from "dotenv";
dotenv.config({ path: "../env/.env.palia" });

import { initializePool } from "./db_connections.js";
import { initDb } from "./initDb.js";

const pool = initializePool();

async function migrate() {
    const conn = await pool.getConnection();
    try {
        const [[{ count }]] = await conn.query("SELECT COUNT(*) AS count FROM items");
        if (Number(count) > 0) {
            console.log(`items table already has ${count} rows — aborting to avoid duplicate migration.`);
            return;
        }

        await conn.beginTransaction();

        // Each entry: { table, category, columns }
        // columns maps items column → old table column (null = not present, use NULL)
        const sources = [
            {
                table: "artifacts",
                category: "artifacts",
                columns: { name: "name", image: "image", url: "url" },
            },
            {
                table: "stickers",
                category: "stickers",
                columns: { name: "name", image: "image", url: "url", rarity: "rarity" },
            },
            {
                table: "potato_pods",
                category: "potato_pods",
                columns: { name: "name", image: "image", url: "url", family: "family" },
            },
            {
                table: "plushies",
                category: "plushies",
                columns: { name: "name", image: "image", url: "url", rarity: "rarity" },
            },
            {
                table: "bugs",
                category: "bugs",
                columns: {
                    name: "name", image: "image", url: "url",
                    description: "description", rarity: "rarity", time: "time",
                    behavior: "behavior", base_value: "base_value",
                },
            },
            {
                table: "fish",
                category: "fish",
                columns: {
                    name: "name", image: "image", url: "url",
                    description: "description", rarity: "rarity", time: "time",
                    bait: "bait", base_value: "base_value",
                },
            },
        ];

        // old_id → new_id maps, keyed by category
        const idMaps = {};

        for (const { table, category, columns } of sources) {
            idMaps[category] = {};
            const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
            console.log(`Migrating ${rows.length} rows from ${table}...`);

            for (const row of rows) {
                const itemCols = ["category", ...Object.keys(columns)];
                const values = [category, ...Object.keys(columns).map((col) => row[columns[col]] ?? null)];
                const placeholders = values.map(() => "?").join(", ");
                const colList = itemCols.map((c) => `\`${c}\``).join(", ");

                const [result] = await conn.execute(
                    `INSERT INTO items (${colList}) VALUES (${placeholders})`,
                    values
                );
                idMaps[category][row.id] = result.insertId;
            }
        }

        // Remap user_inventory
        console.log("Remapping user_inventory...");
        for (const [category, map] of Object.entries(idMaps)) {
            for (const [oldId, newId] of Object.entries(map)) {
                await conn.execute(
                    "UPDATE user_inventory SET item_id = ? WHERE category = ? AND item_id = ?",
                    [newId, category, oldId]
                );
            }
        }

        // Remap user_favorites
        console.log("Remapping user_favorites...");
        for (const [category, map] of Object.entries(idMaps)) {
            for (const [oldId, newId] of Object.entries(map)) {
                await conn.execute(
                    "UPDATE user_favorites SET item_id = ? WHERE category = ? AND item_id = ?",
                    [newId, category, oldId]
                );
            }
        }

        // Migrate link tables
        console.log("Migrating bugs_location_link...");
        const [bugLocs] = await conn.query("SELECT * FROM bugs_location_link");
        for (const row of bugLocs) {
            const newId = idMaps.bugs[row.bugs_id];
            if (newId) await conn.execute(
                "INSERT INTO item_location_link (item_id, location_id) VALUES (?, ?)",
                [newId, row.location_id]
            );
        }

        console.log("Migrating bugs_needed_for_link...");
        const [bugNeeds] = await conn.query("SELECT * FROM bugs_needed_for_link");
        for (const row of bugNeeds) {
            const newId = idMaps.bugs[row.bugs_id];
            if (newId) await conn.execute(
                "INSERT INTO item_needed_for_link (item_id, needed_for_id) VALUES (?, ?)",
                [newId, row.needed_for_id]
            );
        }

        console.log("Migrating fish_location_link...");
        const [fishLocs] = await conn.query("SELECT * FROM fish_location_link");
        for (const row of fishLocs) {
            const newId = idMaps.fish[row.fish_id];
            if (newId) await conn.execute(
                "INSERT INTO item_location_link (item_id, location_id) VALUES (?, ?)",
                [newId, row.location_id]
            );
        }

        console.log("Migrating fish_needed_for_link...");
        const [fishNeeds] = await conn.query("SELECT * FROM fish_needed_for_link");
        for (const row of fishNeeds) {
            const newId = idMaps.fish[row.fish_id];
            if (newId) await conn.execute(
                "INSERT INTO item_needed_for_link (item_id, needed_for_id) VALUES (?, ?)",
                [newId, row.needed_for_id]
            );
        }

        console.log("Migrating plushies_how_to_obtain_link...");
        const [plushLinks] = await conn.query("SELECT * FROM plushies_how_to_obtain_link");
        for (const row of plushLinks) {
            const newId = idMaps.plushies[row.plushies_id];
            if (newId) await conn.execute(
                "INSERT INTO item_how_to_obtain_link (item_id, how_to_obtain_id) VALUES (?, ?)",
                [newId, row.how_to_obtain_id]
            );
        }

        await conn.commit();
        console.log("Migration complete.");
        console.log("ID maps (old → new):");
        for (const [cat, map] of Object.entries(idMaps)) {
            console.log(`  ${cat}:`, map);
        }
        console.log("\nOld tables have NOT been dropped. Verify the migration, then drop them manually.");

    } catch (err) {
        await conn.rollback();
        console.error("Migration failed — rolled back.", err);
    } finally {
        conn.release();
        pool.end();
    }
}

migrate();
