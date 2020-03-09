import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import StrongParams from '../../src/middleware/StrongParam';

describe('Strong Parameters Middleware', function() {

  context('Good Parameters', function() {
    it('Valid string parameters', function() {
      const strongParams = {
        email: 'string',
        password: 'string',
      };
      const body = {
        email: 'test@test.com',
        password: 'password',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(request.body).to.equal(undefined);
      expect(response.locals.body).to.eql(body);
      expect(response.locals.body.email).to.be.a(strongParams.email);
      expect(response.locals.body.password).to.be.a(strongParams.password);
    });

    it('Valid Number Parameters', function() {
      const strongParams = {
        age: 'number',
        birthYear: 'number',
      };
      const body = {
        age: 22,
        birthYear: 1997,
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(request.body).to.equal(undefined);
      expect(response.locals.body).to.eql(body);
      expect(response.locals.body.age).to.be.a(strongParams.age);
      expect(response.locals.body.birthYear).to.be.a(strongParams.birthYear);
    });

    it('Various Valid Parameters', function() {
      const strongParams = {
        name: 'string',
        age: 'number',
        isStudent: 'boolean',
      };
      const body = {
        name: 'John Doe',
        age: 22,
        isStudent: true,
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(request.body).to.equal(undefined);
      expect(response.locals.body).to.eql(body);
      expect(response.locals.body.name).to.be.a(strongParams.name);
      expect(response.locals.body.age).to.be.a(strongParams.age);
      expect(response.locals.body.isStudent).to.be.a(strongParams.isStudent);
    });
  });

  context('Bad Parameters', function() {
    it('Wrong Parameter Type', function() {
      const strongParams = {
        name: 'string',
        age: 'number',
      };
      const body = {
        name: 'John Doe',
        age: '12',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(request.body).to.equal(undefined);
      expect(response.locals.body.name).to.be.a(strongParams.name);
      expect(response.locals.body).to.not.have.key('age');
    });

    it('Object used as a parameter', function() {
      const strongParams = {
        birthday: 'object',
      };
      const body = {
        birthday: new Date(),
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(response.locals.body).to.not.have.key('birthday');
    });

    it('boolean as string', function() {
      const strongParams = {
        isTrue: 'boolean',
      };
      const body = {
        isTrue: 'false',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        body,
      });
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      StrongParams(strongParams)(request, response, next);
      expect(next.calledOnce).to.equal(true);
      expect(next.getCall(0).args[0]).to.equal(undefined);
      expect(response.locals.body).to.not.have.key('isTrue');
    });
  });
});