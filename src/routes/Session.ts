// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/logout', (req: Request, res: Response) => {
  return res.status(200).send(res.locals);
}); 