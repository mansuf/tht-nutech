const Pool = require("pg-pool");
const { URL } = require('node:url');


const connectDB = async () => {
  const databaseUrl = process.env.POSTGRES_URL;
  const u = new URL(databaseUrl);

  const config = {
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    host: u.hostname,
    port: u.port,
    database: u.pathname.slice(1),
    ssl: false,
  }

  const pool = new Pool(config);
  
  const client = await pool.connect();
  return client;
};

module.exports = connectDB;
