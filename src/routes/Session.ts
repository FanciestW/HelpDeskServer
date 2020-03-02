// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/logout', (req: Request, res: Response) => {
  return res.status(200).send('Session Logout');
});

router.post('/new', (req: Request, res: Response) => {
  return res.status(200).send('New Session Created');
});

router.post('/check', (req: Request, res: Response) => {
  return res.status(200).send('Session Check');
});

export default router;
