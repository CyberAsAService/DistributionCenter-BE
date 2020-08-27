import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";
const morgan = require('morgan');

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleLogging = (router: Router) => {
  router.use(morgan('combined'));
};
