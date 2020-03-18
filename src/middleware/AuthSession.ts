import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../utils/SessionHelper';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.signedCookies?.session) {
    const sid = req.signedCookies.session;
    if (await validateSession(sid)) {
      res.locals.sessionCookie = sid;
      return next();
    } else {
      return res.sendStatus(400);
    }
  } else {
    return res.sendStatus(400);
  }
};