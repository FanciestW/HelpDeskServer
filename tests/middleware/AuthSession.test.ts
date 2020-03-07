import mocha from 'mocha';
import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import nanoid from 'nanoid';
import AuthSessionMiddlware from '../../src/middleware/AuthSession';

describe('Session Authentication Middleware Test', function () {
  const validUser = {
    uid: nanoid(),
    firstName: 'John',
    middleName: 'Jay',
    lastName: 'Doe',
    email: 'jdoe@test.com',
    passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
    phone: '123-123-1234',
    company: 'Test Inc.',
    isTechnician: true,
  };

  context('Valid Sessions', function() {
    it('Session Sign up', function() {
      const request = httpMocks.createRequest({
        method: 'POST',
        signedCookies: {
          session: nanoid(),
        }
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
    });
  });

  context('Bad Sessions', function() {
    it('No Auth Session', function() {
      const request = httpMocks.createRequest({
        method: 'POST',
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      AuthSessionMiddlware(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(Error('Unable to authenticate user session'));
    });
  });
});