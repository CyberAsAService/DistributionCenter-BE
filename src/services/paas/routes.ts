import { Request, Response } from "express";
const axios = require("axios");
import db from "../../config/db";
export default [
  {
    path: "/PaaS",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      await db.none(
        'UPDATE public."Steps" SET endtime=CURRENT_TIMESTAMP, status=${status} WHERE microtask_id = ${step_id}',
        {
          status: req.body.success ? "success" : "failed",
          step_id: req.body.task_id,
        }
      );
      if (req.body.success) {
        //TODO -> run only pending tasks
        const tasks = (await db.many(`select tasks.id, tasks.command, endpoint_id 
        from public."Tasks" as tasks 
        right join public."Subtasks" as subtasks 
        on subtasks.task_id = tasks.id
        where endpoint_id in (select endpoint_id from public."Endpoints" where ip = $<ip>)` , {ip:req.body.address}));
        
        //TODO - > Only one instance of spesific command on an enndpoint at any given time.
        tasks.forEach(async (element:any) => {
          let responseExecute = (
            await axios.post("http://localhost:5001/execute", {
              ip_address: req.body.address,
              username: "Witcher",
              password: "Switcher",
              process: "powershell",
              command: element.command,
            })
          ).data;
          await db.none(
            'INSERT INTO public."Steps"(task_id, status, starttime, endpoint_id, endtime, type, args, microtask_id) VALUES (${task_id}, ${status},CURRENT_TIMESTAMP, ${endpoint_id}, NULL, ${type}, ${args}, ${microtask_id})',
            {
              task_id: element.id,
              status: "Pending",
              endpoint_id: element.endpoint_id,
              type: "executer",
              args: req.body.steps,
              microtask_id: responseExecute.task_id,
            }
          );
        });
      }
    res.json(true);
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
