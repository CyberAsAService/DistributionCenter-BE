const pgp = require('pg-promise')({
  query(e:any){console.log(e.query + "\n");}
});

const connection = {
  host: process.env.DB_HOST, // 'localhost' is the default;
  port: process.env.DB_PORT, // 5432 is the default;
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const db = pgp(connection);

export default db;