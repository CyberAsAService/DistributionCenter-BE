import db from "../../config/db";
import { Request, Response, NextFunction } from 'express';
import * as controller from './executer-controller';
import { LooseObject } from '../../utils/models';
import { pinger } from '../../middleware/checks';
const axios = require('axios')
export default [
  {
    path: "/Executer/Status",
    method: "post",
    handler: async (req: Request, res: Response) => {
      // TODO -> replace microservice path
      let statusExecuter = (await axios.get(`http://${process.env.EAAS_MICROSERVICE}/status/${req.body.task_id}`)).data;
      if (statusExecuter["status"] == "SUCCESS") {
        //TODO -> return executer task_id from db
        // for now return step id (from celery) 
        res.status(200).json(statusExecuter);
      }
      else {
        // TODO: choose a more specific error code
        res.status(500).json(statusExecuter);
      }
    }
  },

  {
    path: "/Executer",
    method: "patch",
    handler: [
      //pinger,
      async (req: Request, res: Response, next: NextFunction) => {
      let params: LooseObject = {step_id: req.body.task_id};
      console.log(req.body);
      
      /*if(req.body.executer) {
        params.status = 'RUNNING';
      } else {
        params.status = req.body.status;
      }*/
        params.status = req.body.status;
        const data = await controller.Executer(params);
        res.status(200).json(true);
      }
    ]},
];
