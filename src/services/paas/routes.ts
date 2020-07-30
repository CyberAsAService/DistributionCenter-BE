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
        username: req.body.username ? req.body.username : "Administrator",
        steps: req.body.steps
      })).data;

      res.json(response);
    }
  },
  {
    path: "/PaaS",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      console.log(req.body);
      res.json(true);
    }
  }
];
