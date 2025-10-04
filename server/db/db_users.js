import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapterUsers = new JSONFile("json_db/users.json");
      const lowdb = new Low(adapterUsers, { users: [] });
      await lowdb.read();

      db = {
        getUserByEmail: async (email) => {
          await lowdb.read();
          return lowdb.data.users.find((u) => u.email === email);
        },
        createUser: async (profile) => {
          await lowdb.read();

          const pictureValue =
            profile.picture === undefined ? null : profile.picture;

          lowdb.data.users.push({
            id: Date.now(), // Simple ID for local
            google_id: profile.id,
            email: profile.email,
            given_name: profile.given_name,
            picture: pictureValue,
          });
          await lowdb.write();
        },
      };
    } else {
      const pool = initializePool();
      db = {
        getUserByEmail: async (email) => {
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );
          return rows[0];
        },
        createUser: async (profile) => {
          const sql =
            "INSERT INTO users (google_id, email, given_name, picture) VALUES (?, ?, ?, ?)";

          const pictureValue =
            profile.picture === undefined ? null : profile.picture;

          const values = [
            profile.id,
            profile.email,
            profile.given_name,
            pictureValue,
          ];
          await pool.execute(sql, values);
        },
      };
    }
  } else {
    // found no host
    throw new Error("Database host not initialized or found.");
  }
  return db;
};

export { createDB };
