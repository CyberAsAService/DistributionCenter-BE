import db from "../../config/db";

export const Executer = async (params: any) => {
    return await db.none('UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',params);
}