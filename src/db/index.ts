import { connection } from '../config/db'; // db connection details
import pgPromise from "pg-promise";
//import * as pgPromise from 'pg-promise'; // pg-promise core library
import {IInitOptions, IDatabase, IMain} from 'pg-promise';
import {IExtensions} from '../utils/models';
import { IConnectionParameters, IClient } from 'pg-promise/typescript/pg-subset';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {

    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        
        //obj.users = new UsersRepository(obj, pgp);
        //obj.products = new ProductsRepository(obj, pgp);
    }
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

const db: ExtendedProtocol = pgp((connection as IConnectionParameters<IClient>));

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export {db, pgp};