import { Request, Response, NextFunction } from 'express';
import winston, { format } from 'winston';
const { combine, timestamp, prettyPrint } = format;
import logdnaWinston from 'logdna-winston';
import os from 'os';

require('dotenv').config();

const net = os.networkInterfaces();
let ipAddr: string;
let macAddr: string;
Object.keys(net).forEach((ifname) => {
  let alias = 0;
  net[ifname].forEach((iface) => {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return; // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      ipAddr = iface.address;
      macAddr = iface.mac;
    } else {
      // this interface has only one ipv4 adress
      ipAddr = iface.address;
      macAddr = iface.mac;
    }
    ++alias;
  });
});

const logDnaOptions = {
  key: process.env.LOGDNA_APIKEY,
  hostname: os.hostname(),
  ip: ipAddr,
  mac: macAddr,
  app: 'HelpDeskServer',
  env: process.env.ENV,
  level: 'info', // Default to debug, maximum level of log, doc: https://github.com/winstonjs/winston#logging-levels
  index_meta: true, // Defaults to false, when true ensures meta object will be searchable
  handleExceptionss: true, // Only add this line in order to track exceptions
};

const logger = winston.createLogger({});

logger.add(new logdnaWinston(logDnaOptions));
logger.add(new winston.transports.Console({
  format: winston.format.simple()
}));

export default (req: Request, _: Response, next: NextFunction) => {
  logger.info({
    message: `Request ID: ${req.headers['requestId']}`,
    data: JSON.stringify({
      method: req.method || '',
      header: req.headers || '',
      body: req.body || '',
      query: req.query || '',
      params: req.params || ''
    }),
  });
  next();
};