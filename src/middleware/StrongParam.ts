import { RequestHandler, Request, Response, NextFunction } from 'express';

export default (types: Record<string, any>): RequestHandler => {
  return function(req: Request, res: Response, next: NextFunction) {
    res.locals.body = {};
    Object.entries(types).forEach(([key, type]) => {
      const weakObj = req.body?.[key];
      if (type !== 'object' && weakObj && typeof weakObj === type) { 
        res.locals.body[key] = weakObj;
      }
    });
    delete req.body;
    return next();
  };
};