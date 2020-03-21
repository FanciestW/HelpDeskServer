import Mongoose from 'mongoose';
import nanoid from 'nanoid';
import User from '../../src/models/User';
import chai, { expect, assert } from 'chai';
chai.use(require('chai-as-promised'));

describe('User Mongoose Model', function() {
  this.slow(1000);
  
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

  before(async function() {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await User.deleteMany({});
  });

  beforeEach(async function() {
    await User.deleteMany({});
  });

  after(async function() {
    await User.deleteMany({});
    await Mongoose.disconnect();
  });

  context('Valid Users', function() {
    it('All information', function() {
      User.create(validUser, (err, newUser) => {
        if (err) {
          throw new Error(`Unable to save User.create with error: ${err}`);
        } else {
          expect(newUser.email).to.equal('jdoe@test.com');
        }
      });
    });

    it('No Optional Information', async function() {
      const optionalUser = Object.assign({}, validUser, {});
      delete optionalUser.middleName;
      delete optionalUser.phone;
      delete optionalUser.company;
      const newUser = await User.create(optionalUser);
      expect(newUser.email).to.equal('jdoe@test.com');
      expect(newUser.middleName).to.not.exist;
      expect(newUser.phone).to.not.exist;
      expect(newUser.company).to.not.exist;
    });

    it('User with No isTechnician field', async function() {
      const userDoc = Object.assign({}, validUser);
      delete userDoc.isTechnician;
      const newUser = await User.create(userDoc);
      expect(newUser.isTechnician).to.equal(false);
    });

    it('User has virtual fullName field on create', async function() {
      const userDocNoMiddleName = Object.assign({}, validUser, { uid: nanoid(), email: 'test@test.com' });
      delete userDocNoMiddleName.middleName;
      const newUser = await User.create(validUser);
      const newUserNoMiddleName = await User.create(userDocNoMiddleName);
      expect(newUser.fullName).to.equal('John Jay Doe');
      expect(newUserNoMiddleName.fullName).to.equal('John Doe');
    });

    it('User has virtual fullName field on query', async function() {
      const newUserNoMiddleNameUid = nanoid();
      const userDocNoMiddleName = Object.assign({}, validUser, { uid: newUserNoMiddleNameUid, email: 'test@test.com' });
      delete userDocNoMiddleName.middleName;
      await User.create(validUser);
      await User.create(userDocNoMiddleName);
      const newUser = await User.findOne({ middleName: 'Jay' });
      const newUserNoMiddleName = await User.findOne({ uid: newUserNoMiddleNameUid });
      expect(newUser.fullName).to.equal('John Jay Doe');
      expect(newUserNoMiddleName.fullName).to.equal('John Doe');
    });
  });

  context('Bad Users', function() {
    it('Bad Email', function() {
      const badEmailUser = Object.assign({}, validUser, { email: 'testing.com' });
      const userPromise = User.create(badEmailUser);
      return assert.isRejected(userPromise, /is an invalid Email$/);
    });

    it('Bad Phone', function() {
      const badPhoneUser = Object.assign({}, validUser, { phone: '123456' });
      const userPromise = User.create(badPhoneUser);
      return assert.isRejected(userPromise, /is an invalid Phone Number$/);
    });

    it('Plain text password', function() {
      const plaintextUser = Object.assign({}, validUser, { passwordDigest: 'password' });
      const userPromise = User.create(plaintextUser);
      return assert.isRejected(userPromise, /is invalid$/);
    });

    it('Duplicate Uid', async function() {
      await User.create(validUser);
      return assert.isRejected(User.create(validUser), /.*(duplicate key error).*/);
    });

    it('Duplicate User Email', async function() {
      await User.create(validUser);
      const newUser = Object.assign({}, validUser, { uid: nanoid() });
      return assert.isRejected(User.create(newUser), /.*(duplicate key error).*/);
    })
  });
});