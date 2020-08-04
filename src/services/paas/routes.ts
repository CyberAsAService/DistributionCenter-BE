import { Request, Response } from "express";
const axios = require("axios");
import db from "../../config/db";
export default [
  {
    path: "/PaaS",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      /* 
          tasks = get all tasks of this endpoint
          if success
            execute all tasks
          else
            fail all tasks
      */
      //if success run on all endpoints
      await db.none(
        'UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',
        {
          status: req.body.success ? "success" : "failed",
          step_id: req.body.task_id,
        }
      );
      if (req.body.success) {
        console.log(await db.any('select * from public."Tasks" where id in (select task_id from public."Subtasks" where endpoint_id = (select endpoint_id from public."Endpoints" where ip = ${ip}))', {ip:req.body.address}))
        /*const responseExecute = (
          await axios.post("http://localhost:5001/execute", {
            ip_address: req.body.address,
            username: "Witcher",
            password: "Switcher",
            process: "powershell",
            command: req.body.payload,
          })
        ).data;*/
      }
    },
  },
  {
    path: "/PaaS/Status/:task_id",
    method: "get",
    handler: async (req: Request, res: Response) => {
      let statusPaaS = (
        await axios.get(`http://192.168.40.130:5000/status/${req.body.task_id}`)
      ).data;
      if (statusPaaS["status"] == "SUCCESS") {
        //TODO -> return executer task_id from db
        return "shit";
      } else {
        return statusPaaS;
      }
    },
  },
];
