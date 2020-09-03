import db from "../../config/db";
import { LooseObject } from "../../utils/models";

export const createTask = async (params: LooseObject) => {
    return await db.one(
        'INSERT INTO public."Tasks"( user_id, command) VALUES ( ${user_id}, ${command}) returning id',
        params);
};

export const insertSubtask = async (params: LooseObject) => {
    await db.none('INSERT INTO public."Subtasks"( task_id, endpoint_id, status, result) VALUES ( ${task_id}, ${endpoint_id}, ${status}, NULL)', 
                    params);
};