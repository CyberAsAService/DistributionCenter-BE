import db from "../../config/db";
import { LooseObject } from "../../utils/models";

export const getTasks = async (params: LooseObject) => {
    return (await db.many(`select tasks.id, tasks.command, endpoint_id 
        from public."Tasks" as tasks 
        right join public."Subtasks" as subtasks 
        on subtasks.task_id = tasks.id
        where endpoint_id in (select endpoint_id from public."Endpoints" where ip = $<ip>)`,
        params));
}

export const updateStep = async (params: LooseObject) => {
    return await db.none(
        'UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',
        params);
};

export const insetStep = async (params: LooseObject) => {
    await db.none(
        'INSERT INTO public."Steps"(task_id, status, starttime, endpoint_id, endtime, type, args, microtask_id) VALUES (${task_id}, ${status},CURRENT_TIMESTAMP, ${endpoint_id}, NULL, ${type}, ${args}, ${microtask_id})',
        params);
};