const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/mvp_avior";

const pool = new Pool({ connectionString });

module.exports = pool;
