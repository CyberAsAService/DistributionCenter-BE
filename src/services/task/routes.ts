import { Request, Response } from "express";
import * as controller from "./task-controller";
import db from "../../config/db";
import { hashPayload } from "../../utils/index";
import { validateAddress } from "../../utils/index";
import { LooseObject } from "../../utils/models";
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
      const id = await controller.createTask({ user_id: 1, command: req.body.payload })

      if (!id) {
        res.status(500).send("Couldn't start task");
      }
      let hash = hashPayload(req.body.payload);
      let response: LooseObject = {};
      let status = 200; // OK as default
      req.body.addresses.forEach(async (address: string) => {
        response[address] = { paasResponse: null, executeResponse: null };
        //@TODO-> return to user lists of invalid endpoints + reason
        if (validateAddress(address)) {
          await controller.insertSubtask({
            task_id: id.id,
            //TODO-> get from user
            endpoint_id: 1,
            status: "PENDING",
          });

          try {
            if (req.body.steps) {
              let responsePaaS = await db.oneOrNone(
                'select microtask_id from public."Steps" where endpoint_id = ${endpoint_id} and type=${type} and endtime is null limit 1',
                { endpoint_id: req.body.endpoint_id, type: "paas" }
              );
              if (!responsePaaS) {
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
            const responseExecute = (
              await axios.post("http://localhost:5000/execute", {
                ip_address: req.body.targets,
                username: "Witcher",
                password: "Switcher",
                process: "powershell.exe",
                command: `(New-Object Net.WebClient).DownloadString('http://${process.env.BE_IDENTIFIER}:${process.env.PORT}/repo/scripts?hash=${hash}').Replace('ï»¿', '').Replace('<insert args here>', '$downloadUrl = "' + "${req.body.downloadUrl}" + '";$output="' +'${req.body.output}'+'";$uploadUrl="' + "${req.body.uploadUrl}" + '";') | iex`,
              })
            ).data;
            response[address]["executeResponse"] = responseExecute;
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
          } catch (error) {
            // Passes errors into the error handler
            console.log(error);
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
