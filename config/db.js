// const postgres = require("postgres");

// const { createPool } = require("mysql");
// const pool = createPool({
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.MYSQL_DB,
//     connectionLimit: 500
// })
// module.exports = pool;

// const pool = postgres('postgres://postgres:Mental@9252411@139.99.28.47:5432/database', {
//   host                 : '139.99.28.47',            // Postgres ip address[s] or domain name[s]
//   port                 : 5432,          // Postgres server port[s]
//   database             : 'mental_health_db',            // Name of database to connect to
//   username             : 'postgres',            // Username of database user
//   password             : 'Mental@9252411',            // Password of database user
// })

// module.exports = pool;

// HOST=139.99.28.47
// DB_PORT=5432
// USERNAME=postgres
// PASSWORD=Mental@9252411
// DATABASE=mental_health_db
// LOGGING=true
// PORT=3000
// JWT_SECRECT=abracadabra
// MAIL_HOST=mail.smtp2go.com
// MAIL_PORT=2525
// MAIL_USER=mental
// MAIL_PASS=Mental@1431
// MAIL_FROM=noreply@imran.com

// import { Pool } from "pg";
const {Pool} = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "139.99.28.47", // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: "mental_health_db", // Name of database to connect to
  username: "postgres", // Username of database user
  password: "Mental@9252411", // Password of database user
});



module.exports = pool
