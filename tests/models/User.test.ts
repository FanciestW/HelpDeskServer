import mongoose from 'mongoose';
import User from '../../src/models/User';
import chai, { expect, assert } from 'chai';
chai.use(require('chai-as-promised'));

describe('User Model', function () {

  const validUser = {
    uid: '1234567890abcdefg',
    firstName: 'John',
    middleName: 'Jay',
    lastName: 'Doe',
    email: 'jdoe@test.com',
    passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
    phone: '123-123-1234',
    company: 'Test Inc.',
    isTechnician: true,
  };

  before(function (done) {
    this.timeout(25000);
    mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }, (err) => {
      if (err) {
        throw new Error(`Failed to connect to MongoDB Test Database with error: ${err}.`);
      } else {
        done();
      }
    });
  });

  beforeEach(function (done) {
    User.deleteMany({}, (err) => {
      if (err) {
        throw new Error(`Unable to delete all Users: ${err}`);
      } else {
        done();
      }
    });
  });

  after(function(done) {
    mongoose.connection.close((err) => {
      if (err) {
        throw new Error(`Error closing mongoose connection: ${err}`);
      } else {
        done();
      }
    });
  });

  context('Valid Users', function () {
    it('All information', function () {
      new User(validUser).save((err, newUser) => {
        if (err) {
          throw new Error(`Unable to save new user with error: ${err}`);
        } else {
          expect(newUser.email).to.equal('jdoe@test.com');
        }
      });
    });
  });

  context('Bad Users', function () {
    it('Bad Email', function () {
      const badEmailUser = Object.assign({}, validUser, { email: 'testing.com' });
      const userPromise = new User(badEmailUser).save();
      assert.isRejected(userPromise, /is an invalid Email$/);
    });
  });

});