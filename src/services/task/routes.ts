import { Request, Response } from "express";
const axios = require("axios");
import db from "../../config/db";
function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
export default [
  {
    path: "/task",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.send("Hello world!");
    },
  },
  {
    path: "/task",
    method: "post",
    handler: async (req: Request, res: Response) => {
      /* 
        add task metadata to db
        if permissions steps is empty: execute, return task_id

        check if there are permission tasks running on this endpoint:
          return existing PaaS task_id
        else
          call PaaS, return PaaS task_id
      */

      // parametersc
      // req.body.payload
      // req.body.targets
      // req.body.target_regex

      const id = await db.one(
        'INSERT INTO public."Tasks"( user_id, command) VALUES ( ${user_id}, ${command}) returning id',
        { user_id: 1, command: req.body.payload}
      );
      if (!id) {
        res.status(500).send("Couldn't start task");
      }
      //TODO -> Multiple endpoints
      const subtasks = await db.none('INSERT INTO public."Subtasks"( task_id, endpoint_id, status, result) VALUES ( ${task_id}, ${endpoint_id}, ${status}, NULL)', {
        task_id: id.id,
        //TODO-> get from user
        endpoint_id: 1,
        status: 'PENDING'
      })
      if (req.body.steps) {
        let responsePaaS = await db.oneOrNone(
          'select microtask_id from public."Steps" where endpoint_id = ${endpoint_id} and type=${type} and endtime is null limit 1',
          { endpoint_id: req.body.endpoint_id, type: "paas" }
        );
        if (!responsePaaS) {
          responsePaaS = (
            await axios.post("http://192.168.40.130:5000/PaaS", {
              address: req.body.address,
              username: req.body.username ? req.body.username : "Administrator",
              steps: req.body.steps,
            })
          ).data;
          await db.none(
            'INSERT INTO public."Steps"(task_id, status, starttime, endpoint_id, endtime, type, args, microtask_id) VALUES (${task_id}, ${status},CURRENT_TIMESTAMP, ${endpoint_id}, NULL, ${type}, ${args}, ${microtask_id})',
            {
              task_id: id.id,
              status: "Pending",
              endpoint_id: req.body.endpoint_id,
              type: "paas",
              args: req.body.steps,
              microtask_id: responsePaaS.task_id,
            }
          );
        } 
        res.json({task_id:id.id});
      } else {
        const responseExecute = (
          await axios.post("http://localhost:5001/execute", {
            ip_address: req.body.address,
            username: "Witcher",
            password: "Switcher",
            process: "powershell",
            command: req.body.payload,
          })
        ).data;
        responseExecute.type = "EaaS";
        // TODO -> SAVE TO DB
        return responseExecute;
      }
    },
  },
  {
    path: "/task/:flow_id",
    method: "delete",
    handler: async (req: Request, res: Response) => {
      res.send(null);
    },
  },
  {
    path: "/task",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      //console.log(req.body);
      res.send(null);
    },
  },
];
