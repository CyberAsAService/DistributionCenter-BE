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
        //@TODO-> return to user lists of invalid endpoints + reason
        if (validateAddress(address)) {
          try {
            const responsePaaS = (await axios.post('http://192.168.36.128:5000/PaaS', {
              address: address,
              username: req.body.username ? req.body.username : "Administrator",
              steps: req.body.steps
            })).data;
            response[address]['paasResponse'] = responsePaaS;

            const responseExecute = (await axios.post('http://localhost:5000/execute', {
              ip_address: req.body.targets,
              username: 'Witcher',
              password: 'Switcher',
              process: 'powershell.exe',
              command: `powershell.exe -command "iex(New-Object Net.WebClient).DownloadString('http://${process.env.BE_IDENTIFIER}:${process.env.PORT}/repo/scripts?hash=${hash}')"`,
            })).data;
            response[address]['executeResponse'] = responseExecute;
          } catch (error) {
            // Passes errors into the error handler
            console.log(error);
          }
        }
      });
      res.json(response);
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
