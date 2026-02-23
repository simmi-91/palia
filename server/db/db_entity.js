import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { initializePool, initializeDbHost } from "./db_connections.js";

let db;
const createDB = async () => {
  if (db) return db;

  const dbHost = initializeDbHost();

  if (dbHost) {
    if (dbHost === "lowdb") {
      const adapter = new JSONFile("json_db/entity.json");
      const lowdb = new Low(adapter, { location: [], neededFor: [] });
      await lowdb.read();

      lowdb.data ||= { location: [], neededFor: [] };
      db = {
        getAllEntities: async (entity) => {
          await lowdb.read();
          const data = lowdb.data?.[entity];
          return Array.isArray(data) ? data : [];
        },

        addEntitiy: async (entity, newItem) => {
          await lowdb.read();
          lowdb.data ||= {};
          lowdb.data[entity] ||= [];
          const data = lowdb.data[entity];
          const nextId =
            data.length > 0
              ? Math.max(
                  ...data
                    .map((item) => (typeof item.id === "number" ? item.id : 0))
                    .concat(0)
                ) + 1
              : 1;
          const itemToInsert = {
            id: nextId,
            title: newItem.title,
            url: newItem.url,
            category: newItem.category,
          };
          data.push(itemToInsert);
          await lowdb.write();
          return { success: true, id: nextId };
        },

        updateEntitiy: async (entity, id, newItem) => {
          await lowdb.read();
          lowdb.data ||= {};
          lowdb.data[entity] ||= [];
          const data = lowdb.data[entity];
          const index = data.findIndex((item) => item.id === id);
          if (index === -1) {
            return { success: false, id, error: "Not found" };
          }
          const existing = data[index];
          data[index] = {
            ...existing,
            title: newItem.title !== undefined ? newItem.title : existing.title,
            url: newItem.url !== undefined ? newItem.url : existing.url,
            category:
              newItem.category !== undefined
                ? newItem.category
                : existing.category,
          };
          await lowdb.write();
          return { success: true, id };
        },

        deleteEntitiy: async (entity, id) => {
          await lowdb.read();
          lowdb.data ||= {};
          lowdb.data[entity] ||= [];
          const data = lowdb.data[entity];
          const index = data.findIndex((item) => item.id === id);
          if (index === -1) {
            return { success: false, id, error: "Not found" };
          }
          data.splice(index, 1);
          await lowdb.write();
          return { success: true, id };
        },
      };
    } else {
      const pool = initializePool();

      const allowedEntities = new Set(["location_entity", "needed_for_entity"]);
      const ensureAllowedEntity = (entity) => {
        if (!allowedEntities.has(entity)) {
          throw new Error(`Disallowed entity/table: ${entity}`);
        }
      };
      db = {
        getAllEntities: async (entity) => {
          ensureAllowedEntity(entity);
          const sql = `SELECT id, title, url, category FROM \`${entity}\``;
          const [rows] = await pool.query(sql);
          return rows;
        },

        addEntitiy: async (entity, newItem) => {
          ensureAllowedEntity(entity);
          const sql = `INSERT INTO '${entity}' (title, url, category) VALUES (?, ?, ?)`;
          const params = [newItem.title, newItem.url, newItem.category];
          const [result] = await pool.execute(sql, params);
          const insertedId =
            result && (result.insertId ?? result.insertId === 0)
              ? result.insertId
              : undefined;
          return { success: true, id: insertedId };
        },

        updateEntitiy: async (entity, id, newItem) => {
          ensureAllowedEntity(entity);

          const fields = [];
          const values = [];
          if (newItem.title !== undefined) {
            fields.push("title = ?");
            values.push(newItem.title);
          }
          if (newItem.url !== undefined) {
            fields.push("url = ?");
            values.push(newItem.url);
          }
          if (newItem.category !== undefined) {
            fields.push("category = ?");
            values.push(newItem.category);
          }
          if (fields.length === 0) {
            return { success: true, id }; // nothing to update
          }
          const sql = `UPDATE '${entity}' SET ${fields.join(
            ", "
          )} WHERE id = ?`;
          values.push(id);
          const [result] = await pool.execute(sql, values);
          const affected =
            result && (result.affectedRows ?? result.rowCount ?? 0);
          if (!affected) {
            return { success: false, id, error: "Not found" };
          }
          return { success: true, id };
        },

        deleteEntitiy: async (entity, id) => {
          ensureAllowedEntity(entity);
          const sql = `DELETE FROM '${entity}' WHERE id = ?`;
          const [result] = await pool.execute(sql, [id]);
          const affected =
            result && (result.affectedRows ?? result.rowCount ?? 0);
          if (!affected) {
            return { success: false, id, error: "Not found" };
          }
          return { success: true, id };
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
