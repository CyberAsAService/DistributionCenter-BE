import { Request, Response } from "express";
import db from "../../config/db";
import { hashPayload } from "../../utils/index";
import { validateAddress } from "../../utils/index";
const axios = require("axios");
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
      // req.body.endpoint_id
      let hash = hashPayload(req.body.payload);
      const id = await db.one(
        'INSERT INTO public."Tasks"( user_id, command) VALUES ( ${user_id}, ${command}) returning id',
        { user_id: 1, command: `(New-Object Net.WebClient).DownloadString('http://${process.env.BE_IDENTIFIER}:${process.env.PORT}/repo/scripts?hash=${hash}').Replace('ï»¿', '').Replace('<insert args here>', '$downloadUrl = "' + "${req.body.downloadUrl}" + '";$output="' +'${req.body.output}'+'";$uploadUrl="' + "${req.body.uploadUrl}" + '";') | iex`}
      );
      if (!id) {
        res.status(500).send("Couldn't start task");
      }
      let response: { [key: string]: any } = {};
      let status = 200; // OK as default
      req.body.addresses.forEach(async (address: string) => {
        response[address] = { paasResponse: null, executeResponse: null };
        response[address]["validStatus"] = validateAddress(address);
        
        if (response[address]["validStatus"].valid == true) {
          const subtasks = await db.none(
            'INSERT INTO public."Subtasks"( task_id, endpoint_id, status, result) VALUES ( ${task_id}, ${endpoint_id}, ${status}, NULL)',
            {
              task_id: id.id,
              endpoint_id: req.body.endpoint_id,
              status: "PENDING",
            }
          );
          try {
            if (req.body.steps) {
              console.log("steps")
              let responsePaaS = await db.oneOrNone(
                'select microtask_id from public."Steps" where endpoint_id = ${endpoint_id} and type=${type} and endtime is null limit 1',
                { endpoint_id: req.body.endpoint_id, type: "paas" }
              );
              console.log("falafel")
              if (!responsePaaS) {
                console.log("respaas")
                responsePaaS = (
                  await axios.post("http://192.168.36.128:5000/PaaS", {
                    address: address,
                    username: req.body.username
                      ? req.body.username
                      : "Administrator",
                    steps: req.body.steps,
                  })
                ).data;
                response[address]["paasResponse"] = responsePaaS;
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
            }
            else{
              console.log("executer :)")
              const responseExecute = (
                await axios.post("http://localhost:5001/execute", {
                  ip_address: address,
                  username: "Witcher",
                  password: "Switcher",
                  process: "powershell.exe",
                  command: `(New-Object Net.WebClient).DownloadString('http://${process.env.BE_IDENTIFIER}:${process.env.PORT}/repo/scripts?hash=${hash}').Replace('ï»¿', '').Replace('<insert args here>', '$downloadUrl = "' + "${req.body.downloadUrl}" + '";$output="' +'${req.body.output}'+'";$uploadUrl="' + "${req.body.uploadUrl}" + '";') | iex`,
                })
              ).data;
              response[address]["executeResponse"] = responseExecute;
              console.log(responseExecute) 
              await db.none(
                'INSERT INTO public."Steps"(task_id, status, starttime, endpoint_id, endtime, type, args, microtask_id) VALUES (${task_id}, ${status},CURRENT_TIMESTAMP, ${endpoint_id}, NULL, ${type}, ${args}, ${microtask_id})',
                {
                  task_id: id.id,
                  status: "Pending",
                  endpoint_id: req.body.endpoint_id,
                  type: "eaas",
                  args: req.body.steps,
                  microtask_id: responseExecute.task_id,
                }
              );

            }
          } catch (error) {
            // Passes errors into the error handler
            throw error;
          }
        }
      });
      res.json(response);
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
