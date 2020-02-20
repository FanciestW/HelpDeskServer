import { Request, Response, NextFunction } from 'express';
import nanoid from 'nanoid';

const tagger = (req: Request, _: Response, next: NextFunction) => {
  req.headers.requestId = nanoid(8);
  next();
};

export default tagger;