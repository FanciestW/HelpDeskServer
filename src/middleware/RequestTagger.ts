import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

export default (req: Request, _: Response, next: NextFunction) => {
  req.headers.requestId = nanoid(20);
  next();
};
