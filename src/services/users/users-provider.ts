import { users as sql } from "../../sql/index";
import { db } from "../../db/index";

export const CreateUser = (id: number) => {
    return db.one(sql.create, {id : id});
};