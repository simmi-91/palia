import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const sql = `
        SELECT
            f.id, f.image, f.name, f.url, f.description, f.rarity, f.time, f.bait,
            f.base_value AS baseValue,
            (
                SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', le.title, 'url', le.url, 'category', le.category)), '[]')
                FROM fish_location_link AS l_link
                LEFT JOIN location_entity AS le ON l_link.location_id = le.id
                WHERE l_link.fish_id = f.id
            ) AS location,
            (
                SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', ne.title, 'url', ne.url, 'category', ne.category)), '[]')
                FROM fish_needed_for_link AS n_link
                LEFT JOIN needed_for_entity AS ne ON n_link.needed_for_id = ne.id
                WHERE n_link.fish_id = f.id
            ) AS neededFor
        FROM fish AS f
        ORDER BY f.id
      `;
      const [rows] = await pool.query(sql);
      return rows.map((row) => ({
        ...row,
        location: JSON.parse(row.location),
        neededFor: JSON.parse(row.neededFor),
      }));
    },
    addItem: async (data) => {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const [result] = await conn.execute(
          "INSERT INTO fish (name, image, url, description, rarity, time, bait, base_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [data.name, data.image, data.url, data.description, data.rarity, data.time, data.bait, data.baseValue]
        );
        const id = result.insertId;
        for (const loc of data.location ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM location_entity WHERE title = ?", [loc.title]);
          if (entity) await conn.execute("INSERT INTO fish_location_link (fish_id, location_id) VALUES (?, ?)", [id, entity.id]);
        }
        for (const nf of data.neededFor ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM needed_for_entity WHERE title = ?", [nf.title]);
          if (entity) await conn.execute("INSERT INTO fish_needed_for_link (fish_id, needed_for_id) VALUES (?, ?)", [id, entity.id]);
        }
        await conn.commit();
        return { success: true, id };
      } catch (err) {
        await conn.rollback();
        return { success: false, error: err.message };
      } finally {
        conn.release();
      }
    },
    updateItem: async (id, data) => {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        await conn.execute(
          "UPDATE fish SET name = ?, image = ?, url = ?, description = ?, rarity = ?, time = ?, bait = ?, base_value = ? WHERE id = ?",
          [data.name, data.image, data.url, data.description, data.rarity, data.time, data.bait, data.baseValue, id]
        );
        await conn.execute("DELETE FROM fish_location_link WHERE fish_id = ?", [id]);
        for (const loc of data.location ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM location_entity WHERE title = ?", [loc.title]);
          if (entity) await conn.execute("INSERT INTO fish_location_link (fish_id, location_id) VALUES (?, ?)", [id, entity.id]);
        }
        await conn.execute("DELETE FROM fish_needed_for_link WHERE fish_id = ?", [id]);
        for (const nf of data.neededFor ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM needed_for_entity WHERE title = ?", [nf.title]);
          if (entity) await conn.execute("INSERT INTO fish_needed_for_link (fish_id, needed_for_id) VALUES (?, ?)", [id, entity.id]);
        }
        await conn.commit();
        return { success: true };
      } catch (err) {
        await conn.rollback();
        return { success: false, error: err.message };
      } finally {
        conn.release();
      }
    },
    deleteItem: async (id) => {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        await conn.execute("DELETE FROM fish_location_link WHERE fish_id = ?", [id]);
        await conn.execute("DELETE FROM fish_needed_for_link WHERE fish_id = ?", [id]);
        const [result] = await conn.execute("DELETE FROM fish WHERE id = ?", [id]);
        await conn.commit();
        if (!result.affectedRows) return { success: false, error: "Not found" };
        return { success: true };
      } catch (err) {
        await conn.rollback();
        return { success: false, error: err.message };
      } finally {
        conn.release();
      }
    },
  };

  return db;
};

export { createDB };
