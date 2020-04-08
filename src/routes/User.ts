// eslint-disable-next-line no-unused-vars
import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import nanoid from 'nanoid';
import StrongParams from '../middleware/StrongParam';
import User from '../models/User';
import { createSession, deleteSession } from '../utils/SessionHelper';
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
router.post('/signup', StrongParams(signUpStrongParams), async (_, res: Response) => {
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
      uid = nanoid(14);
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

export default router;