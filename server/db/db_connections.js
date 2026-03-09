import mysql from "mysql2/promise";

let pool;
function initializePool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    typeCast: (field, next) => {
      if (field.type === "TINY" && field.length === 1) return field.string() === "1";
      return next();
    },
  });
}

export { initializePool, pool };
