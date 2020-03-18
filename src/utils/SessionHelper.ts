import nanoid from 'nanoid';
import crypto from 'crypto';
import Session from '../models/Session';
import ISession from '../interfaces/Session';

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