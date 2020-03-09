import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.signedCookies?.session) {
    const sid = req.signedCookies.session;
    const userSession = await Session.findOne({
      $and: [
        { sid },
        { expiresAt: { $gt: new Date() } },
      ]
    });
    if (userSession) {
      res.locals.sessionCookie = sid;
      return next();
    } else {
      return next(new Error('Unable to authenticate user session'));
    }
  } else {
    return next(new Error('Unable to authenticate user session'));
  }
};