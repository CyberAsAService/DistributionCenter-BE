require('dotenv').config()
import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from "./services";

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);

console.table(routes.map(route => {
  return { path: route.path, method: route.method }
}));

const { PORT = 3000 } = process.env;
const server = http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);
