import { Request, Response } from "express";
import * as controller from "./paas-controller";
const axios = require("axios");

export default [
  {
    path: "/PaaS",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      // @TODO: (sub)task = UpForRetryPermissions if failed 
      // @TODO: make permission succeed?
      controller.updateStep({
        status: req.body.success ? "success" : "failed",
        step_id: req.body.task_id,
      });

      if (req.body.success) {
        //TODO@TalShafir #29 -> run only pending tasks
        const tasks: any[] = await controller.getTasks({ ip: req.body.address });

        //TODO - > Only one instance of specific command on an enndpoint at any given time.
        // @TODO: (sub)task = QueuedForExecute 
        tasks.forEach(async (element: any) => {
          let responseExecute = (
            await axios.post("http://localhost:5001/execute", {
              ip_address: req.body.address,
              username: "Witcher",
              password: "Switcher",
              process: "powershell",
              command: element.command,
            })
          ).data;
          await controller.insertStep({
            task_id: element.id,
            status: "Pending",
            endpoint_id: element.endpoint_id,
            type: "executer",
            args: req.body.steps,
            microtask_id: responseExecute.task_id,
          });
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
