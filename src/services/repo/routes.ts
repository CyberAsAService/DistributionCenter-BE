import { Request, Response } from "express";
const axios = require('axios')


const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

var scripts:Map<string, String> = new Map();
var ppath = __dirname.split(path.sep);
ppath.pop();
ppath.pop();
ppath.pop();
var directoryPath =ppath.join(path.sep);
directoryPath = path.join(directoryPath, 'Scripts');
var dirreader = function(dir:string){
  var files = fs.readdirSync(dir);
  //listing all files using forEach
  files.forEach(function (file: any) {
      // Do whatever you want to do with the file
      let data = fs.readFileSync(path.join(directoryPath, file), "utf8");
      let content =`${data}`;
      let hash = crypto.createHmac('sha256', file)
                   .update('I love Witcher')
                   .digest('hex');
      scripts.set(hash, content);
    });
};
dirreader(directoryPath);
console.log(scripts);
export default [
    {
        path: "/repo/scripts",
        method: "get",
        handler: async (req: Request, res: Response) => {
            console.log(req.query.hash);
            res.send(scripts.get(req.query.hash));   
        }
    }
];
