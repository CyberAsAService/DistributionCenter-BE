import { Request, Response } from "express";
const axios = require('axios')

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
      // parameters
      // req.body.payload
      // req.body.targets
      // req.body.target_regex
      const responsePaaS = (await axios.post('http://localhost:5000/PaaS', {
        ip_address: req.body.address,
        username: req.body.username ? req.body.username : "Administrator",
        steps: req.body.steps
      })).data;
      const responseExecute = (await axios.post('http://localhost:5000/execute', {
        ip_address: req.body.targets,
        username: 'Witcher',
        password: 'Switcher',
        process: 'powershell.exe',
        command: req.body.payload,
      })).data;
      res.json(responseExecute);
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
