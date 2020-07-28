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
      const response = (await axios.post('http://localhost:5000/execute', {
        ip_address: req.body.targets,
        username: 'kaki',
        password: '123',
        process: 'powershell.exe',
        command: req.body.payload,
      })).data;
      res.json(response);
    }
  },
  {
    path: "/task/:flow_id",
    method: "delete",
    handler: async (req: Request, res: Response) => {
      res.send(null);
    }
  }
];
