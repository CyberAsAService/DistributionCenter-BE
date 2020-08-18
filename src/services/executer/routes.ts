import { Request, Response } from "express";
const axios = require('axios')
import db from "../../config/db";

export default [
    {
        path: "/Executer/Status",
        method: "post",
        handler: async (req: Request, res: Response) => {
        let statusExecuter = (await axios.get(`http://192.168.40.130:5000/status/${req.body.task_id}`)).data;
        if(statusExecuter["status"] == "SUCCESS")
        {
          //TODO -> return executer task_id from db
          return "shit";
        }
        else
        {
          return statusExecuter;
        }
        }},

        {
          path: "/Executer",
          method: "patch",
          handler: async (req: Request, res: Response) => {
            //console.log(req.body)
            if(req.body.executer)
            {
              await db.none('UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',
              {
                status: 'RUNNING',
                step_id: req.body.task_id,
              });
            }
            else{
              await db.none('UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',
              {
                status: req.body.status,
                step_id: req.body.task_id,
              });
            }
            res.json(true);
            }
          },
];
