import { Request, Response } from "express";
const axios = require('axios')
import { validateAddress } from "../../utils/index"

export default [
  {
    path: "/task",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.send("Hello world!");
    }
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


      // parameters
      // req.body.payload
      // req.body.targets
      // req.body.target_regex

      //final response mapping {name:response}
      let response: { [key: string]: any } = {};
      let status = 200; // OK as default
      req.body.addresses.forEach(async (address: string) => {
        response[address] = { paasResponse: null, executeResponse: null };
        if (!validateAddress(address)) {
          // TODO determine the proper way to handle error
          status = 422; // Unprocessable Entity 
        } else {
          try {
            const responsePaaS = (await axios.post('http://192.168.36.128:5000/PaaS', {
              address: address,
              username: req.body.username ? req.body.username : "Administrator",
              steps: req.body.steps
            })).data;
            response[address]['paasResponse'] = responsePaaS;

            const responseExecute = (await axios.post('http://localhost:5001/execute', {
              address: address,
              username: 'Witcher',
              password: 'Switcher',
              process: 'powershell.exe',
              command: req.body.payload,
            })).data;
            response[address]['executeResponse'] = responseExecute;
          } catch (error) {
            // Passes errors into the error handler
            // TODO determine if to show error code for one failing endpoint or not
            status = 422; // Unprocessable Entity 
            console.log(error);
          }
          finally {
            res.status(status).json(response);
          }

        }

      });
    }
  },
  {
    path: "/task/:flow_id",
    method: "delete",
    handler: async (req: Request, res: Response) => {
      res.send(null);
    }
  },
  {
    path: "/task",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      console.log(req.body);
      res.send(null);
    }
  },
];
