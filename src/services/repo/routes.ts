import { Request, Response } from "express";
const axios = require('axios')
import { loadScriptsMap } from "../../utils/index"

let scripts: Map<string, String> = loadScriptsMap();

export default [
  {
    path: "/repo/scripts",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.send(scripts.get(req.query.hash));
    }
  }
  ,
  {
    path: "/repo/deployer",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      /* 
          tasks = get all tasks of this endpoint
          if success
            execute all tasks
          else
            fail all tasks
      */
      console.log(req.body);
      res.json(true);
    }
  }
];
