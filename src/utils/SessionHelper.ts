import nanoid from 'nanoid';
import crypto from 'crypto';
import Session from '../models/Session';
import ISession from '../interfaces/Session';
import IUser from '../interfaces/User';
import User from '../models/User';

/**
 * Given a user ID, create a new session and hash it for the database.
 * @param uid The UID to create a new session for.
 */
export async function createSession(uid: string): Promise<string> {
  let sid;
  let hashSid;
  do {
    sid = nanoid();
    hashSid = crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
  } while (await Session.findOne({ sid: hashSid, }));
  await new Session({ uid, sid: hashSid }).save();
  return sid;
}

/**
 * Given an un-hashed session ID, hash it and delete it from the database.
 * @param sid The un-hashed SID to delete from the database.
 * @returns Promise<ISession> with the session object that was deleted.
 */
export async function deleteSession(sid: string): Promise<ISession> {
  const hashedSid = crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
  return await Session.findOneAndDelete({ sid: hashedSid });
}

export async function validateSession(sid: string): Promise<Boolean> {
  const hashedSid = crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
  if (await Session.exists({
    $and: [
      { sid: hashedSid },
      { expiresAt: { $gt: new Date() } },
    ]
  })) {
    return true;
  } else {
    return false;
  }
}

/**
 * Given an un-hashed session ID, hash it and retrieve the user object associated with it.
 * @param sid The un-hashed SID to search with.
 * @returns Promise<IUser> with the User object that is associated with the session.
 */
export async function getUserFromSession(sid: string): Promise<IUser> {
  const hashedSid = crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
  const sessionObj = await Session.findOne({
    $and: [
      { sid: hashedSid },
      { expiresAt: { $gt: new Date() } },
    ]
  }).select('uid');
  if (sessionObj?.uid) {
    return await User.findOne({ uid: sessionObj.uid });
  } else {
    return undefined;
  }
}

/**
 * Given an un-hashed session ID, hash it and retrieve the user ID associated with it.
 * @param sid The un-hashed SID to search with.
 * @returns Promise<String> containing the UID found, undefined if nothing is found.
 */
export async function getUidFromSession(sid: string): Promise<String> {
  const hashedSid = crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
  const sessionObj = await Session.findOne({
    $and: [
      { sid: hashedSid },
      { expiresAt: { $gt: new Date() } },
    ]
  }).select('uid');
  if (sessionObj?.uid) {
    return sessionObj.uid;
  } else {
    return undefined;
  }
}
