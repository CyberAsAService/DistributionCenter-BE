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
      req.body.addresses.forEach(async (address: string) => 
      {
        try{
      const responsePaaS = (await axios.post('http://192.168.36.128:5000/PaaS', {
        address: address,
        username: req.body.username ? req.body.username : "Administrator",
        steps: req.body.steps
      })).data;
      const responseExecute = (await axios.post('http://localhost:5001/execute', {
        address: address,
        username: 'Witcher',
        password: 'Switcher',
        process: 'powershell.exe',
        command: req.body.payload,
      })).data;
      res.json(responseExecute);
    } catch (error) {
      // Passes errors into the error handler
      console.log(error);
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
