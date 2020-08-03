import { Request, Response } from "express";
const axios = require('axios')

export default [
  {
    path: "/PaaS",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      /* 
          tasks = get all tasks of this endpoint
          if success
            execute all tasks
          else
            fail all tasks
      */
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
  },
  {
    path: "/PaaS/Status",
    method: "post",
    handler: async (req: Request, res: Response) => {
    let statusPaaS = (await axios.get(`http://192.168.40.130:5000/status/${req.body.task_id}`)).data;
    if(statusPaaS["status"] == "SUCCESS")
    {
      //TODO -> return executer task_id from db
      return "shit";
    }
    else
    {
      return statusPaaS;
    }
    }},
];
