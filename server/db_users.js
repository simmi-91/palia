import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { pool } from "./db_connections.js";

let db;
if (process.env.DB_HOST) {
  db = {
    getUserByEmail: async (email) => {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0]; // Returns first user found or undefined
    },
    createUser: async (profile) => {
      const sql =
        "INSERT INTO users (google_id, email, given_name, picture) VALUES (?, ?, ?, ?)";
      const values = [
        profile.id,
        profile.email,
        profile.given_name,
        profile.picture,
      ];
      await pool.execute(sql, values);
    },
  };
} else {
  console.log("Using LowDB for local development.");

  const adapterUsers = new JSONFile("users.json");
  const lowdb = new Low(adapterUsers, { users: [] });
  await lowdb.read();

  db = {
    getUserByEmail: async (email) => {
      await lowdb.read();
      return lowdb.data.users.find((u) => u.email === email);
    },
    createUser: async (profile) => {
      await lowdb.read();
      // Use the same fields as the SQL table for consistency
      lowdb.data.users.push({
        id: Date.now(), // Simple ID for local
        google_id: profile.id,
        email: profile.email,
        given_name: profile.given_name,
        picture: profile.picture,
      });
      await lowdb.write();
    },
  };
}

export default db;
