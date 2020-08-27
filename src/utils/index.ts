import { Router, Request, Response, NextFunction } from "express";

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type Route = {
  path: string;
  method: string;
  handler: Handler | Handler[];
};

export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any)[method](path, handler);
  }
};

export const validateAddress = (address: string) => {
  const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (IP_REGEX.test(address)) {
    return true;
  } else {
    // TODO: add testing for endpoint name (in the domain)
    // @TODO -> return error(invalid ip, dns...)
    return false;
  }


export const hashPayload = (payload: string) => {
  return crypto.createHmac('sha256', payload)
    .update('I love Witcher')
    .digest('hex');
}

export const loadScriptsMap = () => {
  var scripts: Map<string, String> = new Map();
  var ppath = __dirname.split(path.sep);
  ppath.pop();
  ppath.pop();
  ppath.pop();
  var directoryPath = ppath.join(path.sep);
  directoryPath = path.join(directoryPath, 'Scripts');
  var files = fs.readdirSync(directoryPath);
  //listing all files using forEach
  files.forEach(function (file: any) {
    // Do whatever you want to do with the file
    let data = fs.readFileSync(path.join(directoryPath, file), "utf8");
    let content = `${data}`; // TODO -> why?
    let hash = hashPayload(file);
    scripts.set(hash, content);
  });
  return scripts;
}