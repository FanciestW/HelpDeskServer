import { RequestHandler, Request, Response, NextFunction } from 'express';

export default (types: Object): RequestHandler => {
  return function(req: Request, res: Response, next: NextFunction) {
    res.locals.body = {};
    Object.entries(types).forEach(([key, type]) => {
      const weakObj = req.body?.[key];
      if (weakObj && typeof weakObj === type) { 
        res.locals.body[key] = weakObj;
      }
    });
    delete req.body;
    return next();
  };
};