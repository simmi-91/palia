import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./db_connections.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedFromJson = async (tableName, jsonPath) => {
    if (!existsSync(jsonPath)) return;
    const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
    if (Number(count) > 0) return;

    const data = JSON.parse(readFileSync(jsonPath, "utf-8"));
    if (!data.length) return;

    // Only insert columns that actually exist in the table — ignores extra fields in seed files
    const [columnRows] = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``);
    const tableColumns = new Set(columnRows.map((r) => r.Field));
    const columns = Object.keys(data[0]).filter((c) => tableColumns.has(c));
    const placeholders = columns.map(() => "?").join(", ");
    const colList = columns.map((c) => `\`${c}\``).join(", ");

    for (const row of data) {
        await pool.execute(
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

    // Unified items table
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
    PRIMARY KEY (item_id, location_id)
  )`,

    `CREATE TABLE IF NOT EXISTS item_needed_for_link (
    item_id INT NOT NULL,
    needed_for_id INT NOT NULL,
    PRIMARY KEY (item_id, needed_for_id)
  )`,

    `CREATE TABLE IF NOT EXISTS item_how_to_obtain_link (
    item_id INT NOT NULL,
    how_to_obtain_id INT NOT NULL,
    PRIMARY KEY (item_id, how_to_obtain_id)
  )`,

    // Wiki catalog tables (legacy — kept until migration verified)
    `CREATE TABLE IF NOT EXISTS artifacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512)
  )`,

    `CREATE TABLE IF NOT EXISTS stickers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    rarity INT
  )`,

    `CREATE TABLE IF NOT EXISTS potato_pods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    family VARCHAR(255)
  )`,

    `CREATE TABLE IF NOT EXISTS bugs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    description TEXT,
    rarity INT,
    time VARCHAR(255),
    behavior VARCHAR(255),
    base_value INT
  )`,

    `CREATE TABLE IF NOT EXISTS bugs_location_link (
    bugs_id INT NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (bugs_id, location_id)
  )`,

    `CREATE TABLE IF NOT EXISTS bugs_needed_for_link (
    bugs_id INT NOT NULL,
    needed_for_id INT NOT NULL,
    PRIMARY KEY (bugs_id, needed_for_id)
  )`,

    `CREATE TABLE IF NOT EXISTS fish (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    description TEXT,
    rarity INT,
    time VARCHAR(255),
    bait VARCHAR(255),
    base_value INT
  )`,

    `CREATE TABLE IF NOT EXISTS fish_location_link (
    fish_id INT NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (fish_id, location_id)
  )`,

    `CREATE TABLE IF NOT EXISTS fish_needed_for_link (
    fish_id INT NOT NULL,
    needed_for_id INT NOT NULL,
    PRIMARY KEY (fish_id, needed_for_id)
  )`,

    `CREATE TABLE IF NOT EXISTS plushies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512),
    url VARCHAR(512),
    rarity INT
  )`,

    `CREATE TABLE IF NOT EXISTS plushies_how_to_obtain_link (
    plushies_id INT NOT NULL,
    how_to_obtain_id INT NOT NULL,
    PRIMARY KEY (plushies_id, how_to_obtain_id)
  )`,
];

export async function initDb() {
    for (const sql of CREATE_STATEMENTS) {
        await pool.execute(sql);
    }
    console.log("Database tables initialized.");

    const seedDir = join(__dirname, "../json_db/seed");

    // Seed entity tables
    await seedFromJson("location_entity", join(seedDir, "location_entity.json"));
    await seedFromJson("needed_for_entity", join(seedDir, "needed_for_entity.json"));
    await seedFromJson("how_to_obtain_entity", join(seedDir, "how_to_obtain_entity.json"));

    if (process.env.NODE_ENV === "development") {
        // Seed catalog tables
        await seedFromJson("artifacts", join(seedDir, "artifacts.json"));
        await seedFromJson("stickers", join(seedDir, "stickers.json"));
        await seedFromJson("potato_pods", join(seedDir, "potato_pods.json"));
        await seedFromJson("bugs", join(seedDir, "bugs.json"));
        await seedFromJson("fish", join(seedDir, "fish.json"));
        await seedFromJson("plushies", join(seedDir, "plushies.json"));

        // Seed junction/link tables
        await seedFromJson("bugs_location_link", join(seedDir, "bugs_location_link.json"));
        await seedFromJson("bugs_needed_for_link", join(seedDir, "bugs_needed_for_link.json"));
        await seedFromJson("fish_location_link", join(seedDir, "fish_location_link.json"));
        await seedFromJson("fish_needed_for_link", join(seedDir, "fish_needed_for_link.json"));
        await seedFromJson(
            "plushies_how_to_obtain_link",
            join(seedDir, "plushies_how_to_obtain_link.json")
        );

        // Seed other tables
        await seedFromJson("links", join(seedDir, "links.json"));
        await seedFromJson("user_inventory", join(seedDir, "user_inventory.json"));
        await seedFromJson("user_favorites", join(seedDir, "user_favorites.json"));
    }
}
