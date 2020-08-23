import { IExtensions } from '../utils/models';
import { IInitOptions, IDatabase, IMain } from 'pg-promise';
import { IConnectionParameters, IClient } from 'pg-promise/typescript/pg-subset';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

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
const db: ExtendedProtocol = pgp((connection as IConnectionParameters<IClient>));
//  const db = pgp(connection);

export default db;