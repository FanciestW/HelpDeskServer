import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import { nanoid } from 'nanoid';
import crypto from 'crypto';
import AuthSessionMiddlware from '../../src/middleware/AuthSession';
import Mongoose from 'mongoose';
import User from '../../src/models/User';
import Session from '../../src/models/Session';

function hashSid(sid: string): string {
  return crypto.createHmac('sha256', process.env.HMAC_KEY || 'secret').update(sid).digest('base64');
}

describe('Session Authentication Middleware Test', function () {
  const validUser = {
    uid: nanoid(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe@test.com',
    passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS'
  };

  before(async function() {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await User.deleteMany({});
    await Session.deleteMany({});
    await User.create(validUser);
  });

  beforeEach(async function() {
    await Session.deleteMany({});
  });

  after(async function() {
    await User.deleteMany({});
    await Session.deleteMany({});
    await Mongoose.disconnect();
  });

  context('Valid Sessions', function() {
    it('Normal Session', async function() {
      const sid = nanoid();
      await Session.create({
        sid: hashSid(sid),
        uid: validUser.uid,
      });
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: sid,
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
    });

    it('Session Cookie in Response.locals', async function() {
      const sid = nanoid();
      await Session.create({
        sid: hashSid(sid),
        uid: validUser.uid,
      });
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: sid,
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(response.locals).to.have.key('sessionCookie');
      expect(response.locals?.sessionCookie).to.be.equal(sid);
    });
  });

  context('Bad Sessions', function() {
    it('No Auth Session', async function() {
      const request = httpMocks.createRequest({
        method: 'POST',
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(false);
      expect(response.statusCode).to.equal(401);
    });

    it('Tampered with Session', async function() {
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: nanoid(),
        }
      });
      request.signedCookies.session = false;
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(false);
      expect(response.statusCode).to.equal(401);
    });

    it('Unsigned Session cookie', async function() {
      const request = httpMocks.createRequest({
        method: 'POST',
        cookies: {
          session: nanoid(),
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(false);
      expect(response.statusCode).to.equal(401);
    });

    it('User Session not in Database', async function() {
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: nanoid(),
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(false);
      expect(response.statusCode).to.equal(401);
    });

    it('User Session Expired', async function() {
      const sid = nanoid();
      await Session.create({
        sid: hashSid(sid),
        uid: validUser.uid,
        createdAt: new Date().setDate(new Date().getDate() - 2),
        expiresAt: new Date().setDate(new Date().getDate() - 1),
      });
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: sid,
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      await AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(false);
      expect(response.statusCode).to.equal(401);
    });
  });
});