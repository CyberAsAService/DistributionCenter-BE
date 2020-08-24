import { Request, Response, NextFunction } from 'express';
import * as controller from './executer-controller';
import { LooseObject } from '../../utils/models';
import { pinger } from '../../middleware/checks';
const axios = require('axios')

export default [{
      path: "/Executer/Status",
      method: "post",
      handler: [
        async (req: Request, res: Response) => {
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
        }]
      },
      {
        path: "/Executer",
        method: "patch",
        handler: [
          pinger,
          async (req: Request, res: Response, next: NextFunction) => {
          let params: LooseObject = {step_id: req.body.task_id};
          
          if(req.body.executer) {
            params.status = 'RUNNING';
          } else {
            params.status = req.body.status;
          }
            const data = await controller.Executer(params);
            res.status(200).json(true);
          }
        ]}
];
