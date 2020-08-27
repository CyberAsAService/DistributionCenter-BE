import { Request, Response, NextFunction } from 'express';
var ping = require('ping');

export const pinger = async (req: Request, res: Response, next: NextFunction) => {
    let hosts: string[] = req.body.hosts;
    hosts.forEach(host => {
        ping.sys.probe(host, (isAlive: string) => {
           if(isAlive) {
                next()
            } else { 
                throw new Error('host isn`t online');
            }
            
        });
    });
}