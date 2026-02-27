import { pool } from "./db_connections.js";

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

  // Wiki catalog tables
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
}
