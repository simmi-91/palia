import { pool } from "../db/db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  db = {
    getAll: async () => {
      const sql = `
        SELECT
            p.id, p.image, p.name, p.url, p.rarity,
            COALESCE(JSON_ARRAYAGG(JSON_OBJECT('title', e.title, 'url', e.url, 'category', e.category)), '[]') AS howToObtain
        FROM plushies p
        LEFT JOIN plushies_how_to_obtain_link l ON p.id = l.plushies_id
        LEFT JOIN how_to_obtain_entity e ON l.how_to_obtain_id = e.id
        GROUP BY p.id, p.image, p.name, p.url, p.rarity
        ORDER BY p.id
      `;
      const [rows] = await pool.query(sql);
      return rows.map((row) => ({
        ...row,
        howToObtain: JSON.parse(row.howToObtain),
      }));
    },
    addItem: async (data) => {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const [result] = await conn.execute(
          "INSERT INTO plushies (name, image, url, rarity) VALUES (?, ?, ?, ?)",
          [data.name, data.image, data.url, data.rarity]
        );
        const id = result.insertId;
        for (const hto of data.howToObtain ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM how_to_obtain_entity WHERE title = ?", [hto.title]);
          if (entity) await conn.execute("INSERT INTO plushies_how_to_obtain_link (plushies_id, how_to_obtain_id) VALUES (?, ?)", [id, entity.id]);
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
          "UPDATE plushies SET name = ?, image = ?, url = ?, rarity = ? WHERE id = ?",
          [data.name, data.image, data.url, data.rarity, id]
        );
        await conn.execute("DELETE FROM plushies_how_to_obtain_link WHERE plushies_id = ?", [id]);
        for (const hto of data.howToObtain ?? []) {
          const [[entity]] = await conn.query("SELECT id FROM how_to_obtain_entity WHERE title = ?", [hto.title]);
          if (entity) await conn.execute("INSERT INTO plushies_how_to_obtain_link (plushies_id, how_to_obtain_id) VALUES (?, ?)", [id, entity.id]);
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
        await conn.execute("DELETE FROM plushies_how_to_obtain_link WHERE plushies_id = ?", [id]);
        const [result] = await conn.execute("DELETE FROM plushies WHERE id = ?", [id]);
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
