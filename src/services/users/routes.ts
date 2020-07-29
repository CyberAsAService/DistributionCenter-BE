import { Request, Response } from "express";

export default [
  {
    path: "/users/:user_id",
    method: "post",
    handler: async (req: Request, res: Response) => {
      res.send(null);
    }
  }
];
