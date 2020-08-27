import {
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleLogging
} from "./common";

export default [handleCors, handleBodyRequestParsing, handleCompression,handleLogging];
