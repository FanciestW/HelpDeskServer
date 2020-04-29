// eslint-disable-next-line no-unused-vars
import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid/async';
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 25);
import StrongParams from '../middleware/StrongParam';
import User from '../models/User';
import { createSession, deleteSession } from '../utils/SessionHelper';
import { sendVerificationEmail } from '../utils/EmailSender';
import EmailVerification from '../models/EmailVerification';
const router = express.Router();

const loginStrongParams = {
  email: 'string',
  password: 'string',
};

router.post('/login', [StrongParams(loginStrongParams)], async (req: Request, res: Response) => {
  try {
    const { email, password } = res.locals.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordDigest)) {
      const sid = await createSession(user.uid);
      return res.cookie('session', sid, { maxAge: 86400000, signed: true, httpOnly: true }).sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

const signUpStrongParams = {
  firstName: 'string',
  lastName: 'string',
  middleName: 'string',
  password: 'string',
  email: 'string',
  phone: 'string',
  company: 'string',
  isTechnician: 'boolean'
};
router.post('/signup', StrongParams(signUpStrongParams), async (req, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      password,
      email,
      phone,
      company,
      isTechnician
    } = res.locals.body;
    if (await User.findOne({ email, })) {
      throw new Error(`User with email: ${email} already exists`);
    }
    let uid: string;
    do {
      uid = await nanoid();
    } while (await User.exists({ uid, }));
    const passwordDigest = await bcrypt.hash(password, process.env.SALT_ROUNDS || 10);
    const newUser = await new User({
      uid,
      firstName,
      lastName,
      middleName,
      passwordDigest,
      email,
      phone,
      company,
      isTechnician
    }).save();
    if (newUser) {
      if (process.env.ENV !== 'DEV') {
        sendVerificationEmail(uid, newUser.email, newUser.firstName, req.headers.host);
      }
      const sid = await createSession(newUser.uid);
      return res.cookie('session', sid, { maxAge: 86400000, signed: true, httpOnly: true }).sendStatus(200);
    } else {
      throw new Error('Unable to create new User');
    }
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const sid = req.signedCookies?.session;
  if (sid) {
    await deleteSession(sid);
  }
  return res.clearCookie('session').sendStatus(200);
});

router.get('/verify', async (req: Request, res: Response) => {
  const token = req.query?.token.toString();
  if (token) {
    const verification = await EmailVerification.findOneAndDelete({
      $and: [
        { expiresAt: { $gt: new Date() } },
        { emailVerificationId: token },
      ]
    });
    if (verification?.uid) {
      await User.updateOne({ uid: verification.uid, }, { verified: true });
      return res.status(200).send('Email verified');
    } else {
      return res.status(400).send('Broken Link, please try sending a new email');
    }
  } else {
    return res.status(400).send('Broken Link, please try sending a new email');
  }
});

export default router;