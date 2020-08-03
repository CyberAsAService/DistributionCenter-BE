import { Request, Response } from "express";
const axios = require('axios')
function sleep(millis:number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}
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


      // parametersc
      // req.body.payload
      // req.body.targets
      // req.body.target_regex
      if(req.body.steps)
      {
      const responsePaaS = (await axios.post('http://192.168.40.130:5000/PaaS', {
        address: req.body.address,
        username: req.body.username ? req.body.username : "Administrator",
        steps: req.body.steps
      })).data;
      responsePaaS.type = "PaaS"
      //TODO -> SAVE TO DB
      return responsePaaS;
    }
  
  else
  {
    const responseExecute = (await axios.post('http://localhost:5001/execute', {
    ip_address: req.body.address,
    username: 'Witcher',
    password: 'Switcher',
    process: 'powershell',
    command: req.body.payload,
  })).data;
    responseExecute.type = "EaaS"
    // TODO -> SAVE TO DB
    return responseExecute;
  }
  }},
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
      //console.log(req.body);
      res.send(null);
    }
    },
];
