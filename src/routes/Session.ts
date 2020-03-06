// eslint-disable-next-line no-unused-vars
import express, { Response } from 'express';
import bcrypt from 'bcrypt';
import nanoid from 'nanoid';
import StrongParams from '../middleware/StrongParam';
import SessionMiddleware from '../middleware/AuthSession';
import StrongParam from '../middleware/StrongParam';
import User from '../models/User';
import Session from '../models/Session';
const router = express.Router();

router.post('/logout', SessionMiddleware, async (_, res: Response) => {
  const sid = res.locals.sessionCookie.sid;
  await Session.findOneAndDelete({ sid, });
  return res.status(200).send('Session Logout');
});

const loginStrongParams = {
  email: 'string',
  password: 'string'
};
router.post('/login', StrongParams(loginStrongParams), async (_, res: Response) => {
  try {
    const { email, password } = res.locals.body;
    const user = await User.findOne({ email });
    if (await bcrypt.compare(password, user.passwordDigest)) {
      return res.sendStatus(200);
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
router.post('/signup', StrongParam(signUpStrongParams), async (_, res: Response) => {
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
    let uid: string;
    do {
      uid = nanoid(14);
    } while (await User.findOne({ uid, }));
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
      let sid = '';
      do {
        sid = nanoid();
      } while (await Session.findOne({ sid, }));
      await new Session({ uid: newUser.uid, sid }).save();
      return res.status(200).cookie('session', sid, { maxAge: 86400000 }).send(newUser);
    } else {
      throw new Error('Unable to create new User');
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export default router;
