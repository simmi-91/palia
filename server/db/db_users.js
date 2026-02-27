import { pool } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getUserByEmail: async (email) => {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows[0];
    },
    createUser: async (profile) => {
      const sql =
        "INSERT INTO users (google_id, email, given_name, picture, created_at, admin) VALUES (?, ?, ?, ?, NOW(), ?)";
      const pictureValue = profile.picture === undefined ? null : profile.picture;
      const values = [profile.id, profile.email, profile.given_name, pictureValue, false];
      await pool.execute(sql, values);
    },
  };

  return db;
};

export { createDB };
