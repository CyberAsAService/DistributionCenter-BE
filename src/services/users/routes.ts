import { Request, Response } from "express";
import * as controller from "./user-controller";

export default [
  {
    path: "/users/:user_id",
    method: "post",
    handler: async (req: Request, res: Response) => {
      const data = controller.CreateUser(req.params.user_id);
      res.send(null);
    }
  }
];
