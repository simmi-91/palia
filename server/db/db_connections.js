import mysql from "mysql2/promise";

let dbHost;
function initializeDbHost() {
  if (dbHost) return dbHost;

  if (process.env.DB_HOST) {
    dbHost = process.env.DB_HOST;
  } else {
    dbHost = null;
  }
}

let pool;
function initializePool() {
  if (pool) return pool;

  if (process.env.DB_HOST) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  } else {
    //console.log("Using LowDB for local development.");
    pool = null;
  }
}

export { initializePool, initializeDbHost, pool, dbHost };
