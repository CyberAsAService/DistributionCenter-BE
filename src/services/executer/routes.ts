import { Request, Response } from "express";
const axios = require('axios')
export default [
    {
        path: "/Executer/Status",
        method: "post",
        handler: async (req: Request, res: Response) => {
        let statusExecuter = (await axios.get(`http://192.168.40.130:5000/status/${req.body.task_id}`)).data;
        if(statusExecuter["status"] == "SUCCESS")
        {
          //TODO -> return executer task_id from db
          return "shit";
        }
        else
        {
          return statusExecuter;
        }
        }},
];
