import Mongoose from 'mongoose';
import User from '../../src/models/User';
import chai, { expect, assert } from 'chai';
chai.use(require('chai-as-promised'));

describe('User Mongoose Model', function() {

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

  before(async function() {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  });

  beforeEach(async function() {
    await User.deleteMany({});
  });

  after(async function() {
    await Mongoose.disconnect();
  });

  context('Valid Users', function() {
    it('All information', function() {
      new User(validUser).save((err, newUser) => {
        if (err) {
          throw new Error(`Unable to save new user with error: ${err}`);
        } else {
          expect(newUser.email).to.equal('jdoe@test.com');
        }
      });
    });

    it('No Optional Information', function() {
      const optionalUser = Object.assign({}, validUser, {});
      delete optionalUser.middleName;
      delete optionalUser.phone;
      delete optionalUser.company;
      new User(optionalUser).save((err, newUser) => {
        if (err) {
          throw new Error(`Unable to save new user with error: ${err}`);
        } else {
          expect(newUser.email).to.equal('jdoe@test.com');
          expect(newUser.middleName).to.not.exist;
          expect(newUser.phone).to.not.exist;
          expect(newUser.company).to.not.exist;
        }
      });
    });
  });

  context('Bad Users', function() {
    it('Bad Email', function() {
      const badEmailUser = Object.assign({}, validUser, { email: 'testing.com' });
      const userPromise = new User(badEmailUser).save();
      assert.isRejected(userPromise, /is an invalid Email$/);
    });

    it('Bad Phone', function() {
      const badPhoneUser = Object.assign({}, validUser, { phone: '123456' });
      const userPromise = new User(badPhoneUser).save();
      assert.isRejected(userPromise, /is an invalid Phone Number$/);
    });

    it('Plain text password', function() {
      const plaintextUser = Object.assign({}, validUser, { passwordDigest: 'password' });
      const userPromise = new User(plaintextUser).save();
      assert.isRejected(userPromise, /PasswordDigest is invalid$/);
    });

    it('Duplicate Uid', async function() {
      const firstUser = await new User(validUser).save();
      assert.isRejected(new User(validUser).save(), /.*(duplicate key error)?.*/);
    });
  });

});