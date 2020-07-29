import { Request, Response } from "express";
const axios = require('axios')

export default [
  {
    path: "/PaaS",
    method: "post",
    handler: async (req: Request, res: Response) => {
      // parameters
      // req.body.address - by ip/ class c
      // username - Default is Administrator
      // steps - steps to take in PAAS 
      const response = (await axios.post('http://localhost:5000/PaaS', {
        ip_address: req.body.address,
        username: "Administrator" ?  "Administrator":req.body.username,
        steps: req.body.steps
      })).data;
      res.json(response);
    }
  },

];
