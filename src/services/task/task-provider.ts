import db from "../../config/db";
import { LooseObject } from "../../utils/models";

export const createTask = async (params: LooseObject) => {
    return await db.one(
        'INSERT INTO public."Tasks"( user_id, command) VALUES ( ${user_id}, ${command}) returning id',
        params);
};

export const createSubtask = async (params: LooseObject) => {
    await db.none('INSERT INTO public."Subtasks"( task_id, endpoint_id, status, result) VALUES ( ${task_id}, ${endpoint_id}, ${status}, NULL)', 
                    params);
};

export const getSubtask = async (params: LooseObject) => {
    return await db.one(
        'SELECT * FROM public."Tasks" where (task_id is null OR task_id = ${id})',
        params);
};

export const getMicrotask = async (params: LooseObject) => {
    return await db.oneOrNone('select * from public."Steps" where endpoint_id = ${endpoint_id} and type=${type} and endtime is null limit 1',
        params);
};

export const createStep = async (params: LooseObject) => {
    await db.none(
        'INSERT INTO public."Steps"(task_id, status, starttime, endpoint_id, endtime, type, args, microtask_id) VALUES (${task_id}, ${status},CURRENT_TIMESTAMP, ${endpoint_id}, NULL, ${type}, ${args}, ${microtask_id})',
        params
      );
};