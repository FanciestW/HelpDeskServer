import { RequestHandler, Request, Response, NextFunction } from 'express';

export default (types: Object): RequestHandler => {
  return function(req: Request, res: Response, next: NextFunction) {
    res.locals.body = {};
    Object.keys(types).forEach((key) => {
      const reqObj = req.body[key];
      if (typeof reqObj === types[key]) { 
        res.locals.body[key] = reqObj;
      }
    });
    delete req.body;
    return next();
  };
};