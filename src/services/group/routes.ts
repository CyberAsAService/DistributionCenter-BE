import { Request, Response } from "express";

export default [{
    path: '/group/:groupName',
    method: 'get',
    handler: [async (req: Request, res: Response) => {
      res.send(null);
    }]
  },
  {
    path: "/group",
    method: "post",
    handler: [async (req: Request, res: Response) => {
      // req.body.groupName
      res.send(null);
    }]
  },
  {
    path: "/group",
    method: "put",
    handler: [async (req: Request, res: Response) => {
      // paramters
      // req.body.group_id
      // req.body.members
      // req.body.endpoints
      res.send(null);
    }]
  }
];
