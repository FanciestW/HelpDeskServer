import Mongoose from 'mongoose';
import uniqid from 'uniqid';
import Session, { SessionSchema } from '../../src/models/Session';
import User from '../../src/models/User';
import chai, { assert, expect } from 'chai';
chai.use(require('chai-as-promised'));

describe('Session Mongoose Model Tests', function () {
  this.slow(1000);
  
  const validSession = {
    sid: uniqid(),
    uid: 'user001',
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400 * 1000,
  };

  before(async function () {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await User.deleteMany({});
    await new User({
      uid: 'user001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@test.com',
      passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
      isTechnician: true,
    }).save();
  });

  beforeEach(async function () {
    await Session.deleteMany({});
  });

  after(async function() {
    await Session.deleteMany({});
    await User.deleteMany({});
  });

  context('Valid Sessions', function () {
    it('New Session', async function () {
      const session = await new Session(validSession).save();
      const now = new Date().getTime() + 86400 * 1000;
      expect(session.uid).to.equal('user001');
      expect(session.expiresAt.getTime()).to.be.within(now - 10000, now + 10000);
    });

    it('New Session Without expiresAt', async function () {
      const sessionDoc = Object.assign({}, validSession);
      delete sessionDoc.expiresAt;
      const session = await new Session(sessionDoc).save();
      const now = new Date().getTime() + 86400 * 1000;
      expect(session.uid).to.equal('user001');
      expect(session.expiresAt.getTime()).to.be.within(now - 10000, now + 10000);
    });

    it('Two Sessions for Same User', async function() {
      const session2Doc = Object.assign({}, validSession, { sid: uniqid() });
      const session1 = await new Session(validSession).save();
      const session2 = await new Session(session2Doc).save();
      const now = new Date().getTime() + 86400 * 1000;
      expect(session1.uid).to.equal(session2.uid);
      expect(session1.sid).to.not.equal(session2.sid);
      expect(session1.expiresAt.getTime()).to.be.within(now - 10000, now + 10000);
      expect(session2.expiresAt.getTime()).to.be.within(now - 10000, now + 10000);
    });
  });

  context('Invalid Sessions', function() {
    it('Duplicate Session', async function() {
      await new Session(validSession).save();
      return assert.isRejected(new Session(validSession).save(), /.*(duplicate key error).*/);
    });

    it('Making 11 Sessions for single user', async function() {
      for (let i = 0; i < 10; i+=1) {
        const sessionDoc = Object.assign({}, validSession, { sid: uniqid() });
        await new Session(sessionDoc).save();
      }
      return assert.isRejected(new Session(validSession).save(), /.*(Too many sessions).*/);
    });

    it('expiresAt is before createdAt', function() {
      const sessionDoc = Object.assign({}, validSession, { expiresAt: Date.now() - 3600000});
      return assert.isRejected(new Session(sessionDoc).save(), /.*(expiresAt cannot be before createdAt).*/);
    });
  });
});