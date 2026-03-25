import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./db_connections.js";
import type { RowDataPacket } from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedFromJson = async (tableName: string, jsonPath: string): Promise<void> => {
    if (!existsSync(jsonPath)) return;
    const [[{ count }]] = await pool!.query<RowDataPacket[]>(`SELECT COUNT(*) as count FROM \`${tableName}\``);
    if (Number(count) > 0) return;

    const data = JSON.parse(readFileSync(jsonPath, "utf-8")) as Record<string, unknown>[];
    if (!data.length) return;

    const [columnRows] = await pool!.query<RowDataPacket[]>(`SHOW COLUMNS FROM \`${tableName}\``);
    const tableColumns = new Set(columnRows.map((r) => r.Field as string));
    const columns = Object.keys(data[0]).filter((c) => tableColumns.has(c));
    const placeholders = columns.map(() => "?").join(", ");
    const colList = columns.map((c) => `\`${c}\``).join(", ");

    for (const row of data) {
        await pool!.execute(
            `INSERT INTO \`${tableName}\` (${colList}) VALUES (${placeholders})`,
            columns.map((c) => row[c] ?? null)
        );
    }
    console.log(`Seeded ${data.length} rows into ${tableName}.`);
};

const CREATE_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    given_name VARCHAR(255) NOT NULL,
    picture VARCHAR(512),
    created_at TIMESTAMP DEFAULT NOW(),
    admin BOOLEAN DEFAULT FALSE
  )`,

    `CREATE TABLE IF NOT EXISTS user_inventory (
    user_id VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, category, item_id)
  )`,

    `CREATE TABLE IF NOT EXISTS user_favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    item_id INT NOT NULL
  )`,

    `CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    logo VARCHAR(512),
    description VARCHAR(1024)
  )`,

    `CREATE TABLE IF NOT EXISTS location_entity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    category VARCHAR(255)
  )`,

    `CREATE TABLE IF NOT EXISTS needed_for_entity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    category VARCHAR(255)
  )`,

    `CREATE TABLE IF NOT EXISTS how_to_obtain_entity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    category VARCHAR(255)
  )`,

    `CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    rarity INT,
    description TEXT,
    time VARCHAR(255),
    base_value INT,
    behavior VARCHAR(255),
    bait VARCHAR(255),
    family VARCHAR(255)
  )`,

    `CREATE TABLE IF NOT EXISTS item_location_link (
    item_id INT NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (item_id, location_id),
    CONSTRAINT fk_ill_location FOREIGN KEY (location_id) REFERENCES location_entity(id) ON DELETE CASCADE
  )`,

    `CREATE TABLE IF NOT EXISTS item_needed_for_link (
    item_id INT NOT NULL,
    needed_for_id INT NOT NULL,
    PRIMARY KEY (item_id, needed_for_id),
    CONSTRAINT fk_infl_needed_for FOREIGN KEY (needed_for_id) REFERENCES needed_for_entity(id) ON DELETE CASCADE
  )`,

    `CREATE TABLE IF NOT EXISTS item_how_to_obtain_link (
    item_id INT NOT NULL,
    how_to_obtain_id INT NOT NULL,
    PRIMARY KEY (item_id, how_to_obtain_id),
    CONSTRAINT fk_ihtol_how_to_obtain FOREIGN KEY (how_to_obtain_id) REFERENCES how_to_obtain_entity(id) ON DELETE CASCADE
  )`,

    `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_tradeable BOOLEAN NOT NULL DEFAULT FALSE,
    is_favoritable BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 99
  )`,
];

export async function initDb(): Promise<void> {
    for (const sql of CREATE_STATEMENTS) {
        await pool!.execute(sql);
    }
    console.log("Database tables initialized.");

    const seedDir = join(__dirname, "../seed");

    await seedFromJson("location_entity", join(seedDir, "location_entity.json"));
    await seedFromJson("needed_for_entity", join(seedDir, "needed_for_entity.json"));
    await seedFromJson("how_to_obtain_entity", join(seedDir, "how_to_obtain_entity.json"));
    await seedFromJson("categories", join(seedDir, "categories.json"));
}
