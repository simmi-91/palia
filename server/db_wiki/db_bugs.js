import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const sql = `
        SELECT
            b.id, b.image, b.name, b.url, b.description, b.rarity, b.time, b.behavior,
            b.base_value AS baseValue,
            (
                SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', le.title, 'url', le.url, 'category', le.category)), '[]')
                FROM bugs_location_link AS l_link
                LEFT JOIN location_entity AS le ON l_link.location_id = le.id
                WHERE l_link.bugs_id = b.id
            ) AS location,
            (
                SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', ne.title, 'url', ne.url, 'category', ne.category)), '[]')
                FROM bugs_needed_for_link AS n_link
                LEFT JOIN needed_for_entity AS ne ON n_link.needed_for_id = ne.id
                WHERE n_link.bugs_id = b.id
            ) AS needed_for
        FROM bugs AS b
        ORDER BY b.id
      `;
      const [rows] = await pool.query(sql);
      return rows.map(({ needed_for, ...row }) => ({
        ...row,
        location: JSON.parse(row.location),
        neededFor: JSON.parse(needed_for),
      }));
    },
    addItem: async (data) => {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const [result] = await conn.execute(
          "INSERT INTO bugs (name, image, url, description, rarity, time, behavior, base_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [data.name, data.image, data.url, data.description, data.rarity, data.time, data.behavior, data.baseValue]
        );
        const id = result.insertId;
        for (const loc of data.location ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM location_entity WHERE title = ?", [loc.title]);
          if (entity) await conn.execute("INSERT INTO bugs_location_link (bugs_id, location_id) VALUES (?, ?)", [id, entity.id]);
        }
        for (const nf of data.neededFor ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM needed_for_entity WHERE title = ?", [nf.title]);
          if (entity) await conn.execute("INSERT INTO bugs_needed_for_link (bugs_id, needed_for_id) VALUES (?, ?)", [id, entity.id]);
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
          "UPDATE bugs SET name = ?, image = ?, url = ?, description = ?, rarity = ?, time = ?, behavior = ?, base_value = ? WHERE id = ?",
          [data.name, data.image, data.url, data.description, data.rarity, data.time, data.behavior, data.baseValue, id]
        );
        await conn.execute("DELETE FROM bugs_location_link WHERE bugs_id = ?", [id]);
        for (const loc of data.location ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM location_entity WHERE title = ?", [loc.title]);
          if (entity) await conn.execute("INSERT INTO bugs_location_link (bugs_id, location_id) VALUES (?, ?)", [id, entity.id]);
        }
        await conn.execute("DELETE FROM bugs_needed_for_link WHERE bugs_id = ?", [id]);
        for (const nf of data.neededFor ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM needed_for_entity WHERE title = ?", [nf.title]);
          if (entity) await conn.execute("INSERT INTO bugs_needed_for_link (bugs_id, needed_for_id) VALUES (?, ?)", [id, entity.id]);
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
        await conn.execute("DELETE FROM bugs_location_link WHERE bugs_id = ?", [id]);
        await conn.execute("DELETE FROM bugs_needed_for_link WHERE bugs_id = ?", [id]);
        const [result] = await conn.execute("DELETE FROM bugs WHERE id = ?", [id]);
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
