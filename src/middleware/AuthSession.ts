import express, { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.signedCookies?.session) {
    const sessionCookie = req.signedCookies.session;
    res.locals.sessionCookie = sessionCookie;
    return next();
  } else {
    return next(new Error('Unable to authenticate user session'));
  }
};