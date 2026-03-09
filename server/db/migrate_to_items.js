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

import { initializePool, pool } from "./db_connections.js";
import { initDb } from "./initDb.js";

initializePool();

async function migrate() {
    await initDb();
    const conn = await pool.getConnection();
    try {
        const [[{ count }]] = await conn.query("SELECT COUNT(*) AS count FROM items");
        if (Number(count) > 0) {
            console.log(
                `items table already has ${count} rows — aborting to avoid duplicate migration.`
            );
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
                category: "potatopods",
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
                    name: "name",
                    image: "image",
                    url: "url",
                    description: "description",
                    rarity: "rarity",
                    time: "time",
                    behavior: "behavior",
                    base_value: "base_value",
                },
            },
            {
                table: "fish",
                category: "fish",
                columns: {
                    name: "name",
                    image: "image",
                    url: "url",
                    description: "description",
                    rarity: "rarity",
                    time: "time",
                    bait: "bait",
                    base_value: "base_value",
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
                const values = [
                    category,
                    ...Object.keys(columns).map((col) => row[columns[col]] ?? null),
                ];
                const placeholders = values.map(() => "?").join(", ");
                const colList = itemCols.map((c) => `\`${c}\``).join(", ");

                const [result] = await conn.execute(
                    `INSERT INTO items (${colList}) VALUES (${placeholders})`,
                    values
                );
                idMaps[category][row.id] = result.insertId;
            }
        }

        // Build user_inventory_new with remapped IDs
        console.log("Building user_inventory_new...");
        await conn.execute("DROP TABLE IF EXISTS user_inventory_new");
        await conn.execute(`CREATE TABLE user_inventory_new LIKE user_inventory`);
        const [inventoryRows] = await conn.query("SELECT * FROM user_inventory");
        for (const row of inventoryRows) {
            const newId = idMaps[row.category]?.[row.item_id];
            if (newId === undefined) {
                console.warn(
                    `  Warning: no mapping for inventory (${row.category}, item_id=${row.item_id}) — skipping`
                );
                continue;
            }
            await conn.execute(
                "INSERT INTO user_inventory_new (user_id, category, item_id, amount) VALUES (?, ?, ?, ?)",
                [row.user_id, row.category, newId, row.amount]
            );
        }

        // Build user_favorites_new with remapped IDs
        console.log("Building user_favorites_new...");
        await conn.execute("DROP TABLE IF EXISTS user_favorites_new");
        await conn.execute(`CREATE TABLE user_favorites_new LIKE user_favorites`);
        const [favoritesRows] = await conn.query("SELECT * FROM user_favorites");
        for (const row of favoritesRows) {
            const newId = idMaps[row.category]?.[row.item_id];
            if (newId === undefined) {
                console.warn(
                    `  Warning: no mapping for favorite (${row.category}, item_id=${row.item_id}) — skipping`
                );
                continue;
            }
            await conn.execute(
                "INSERT INTO user_favorites_new (favorite_id, user_id, category, item_id) VALUES (?, ?, ?, ?)",
                [row.favorite_id, row.user_id, row.category, newId]
            );
        }

        // Migrate link tables
        console.log("Migrating bugs_location_link...");
        const [bugLocs] = await conn.query("SELECT * FROM bugs_location_link");
        for (const row of bugLocs) {
            const newId = idMaps.bugs[row.bugs_id];
            if (newId)
                await conn.execute(
                    "INSERT INTO item_location_link (item_id, location_id) VALUES (?, ?)",
                    [newId, row.location_id]
                );
        }

        console.log("Migrating bugs_needed_for_link...");
        const [bugNeeds] = await conn.query("SELECT * FROM bugs_needed_for_link");
        for (const row of bugNeeds) {
            const newId = idMaps.bugs[row.bugs_id];
            if (newId)
                await conn.execute(
                    "INSERT INTO item_needed_for_link (item_id, needed_for_id) VALUES (?, ?)",
                    [newId, row.needed_for_id]
                );
        }

        console.log("Migrating fish_location_link...");
        const [fishLocs] = await conn.query("SELECT * FROM fish_location_link");
        for (const row of fishLocs) {
            const newId = idMaps.fish[row.fish_id];
            if (newId)
                await conn.execute(
                    "INSERT INTO item_location_link (item_id, location_id) VALUES (?, ?)",
                    [newId, row.location_id]
                );
        }

        console.log("Migrating fish_needed_for_link...");
        const [fishNeeds] = await conn.query("SELECT * FROM fish_needed_for_link");
        for (const row of fishNeeds) {
            const newId = idMaps.fish[row.fish_id];
            if (newId)
                await conn.execute(
                    "INSERT INTO item_needed_for_link (item_id, needed_for_id) VALUES (?, ?)",
                    [newId, row.needed_for_id]
                );
        }

        console.log("Migrating plushies_how_to_obtain_link...");
        const [plushLinks] = await conn.query("SELECT * FROM plushies_how_to_obtain_link");
        for (const row of plushLinks) {
            const newId = idMaps.plushies[row.plushies_id];
            if (newId)
                await conn.execute(
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
        console.log("\nNext steps — verify, then run in MySQL:");
        console.log(
            "  RENAME TABLE user_inventory TO user_inventory_old, user_inventory_new TO user_inventory;"
        );
        console.log(
            "  RENAME TABLE user_favorites TO user_favorites_old, user_favorites_new TO user_favorites;"
        );
        console.log("  -- Then drop old catalog tables once backend is updated.");
    } catch (err) {
        await conn.rollback();
        console.error("Migration failed — rolled back.", err);
    } finally {
        conn.release();
        pool.end();
    }
}

migrate();
