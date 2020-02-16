import mongoose from 'mongoose';
import User from '../../src/models/User';
import { expect } from 'chai';

describe('User Model', function () {
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
    mongoose.connection.db.dropCollection('users', (err) => {
      if (err) {
        throw new Error(`Failed to drop 'users' collection with error: ${err}`);
      } else {
        done();
      }
    });
  });

  context('Valid Users', function() {
    it('All information', function() {
      const newUser = new User({
        uid: '1234567890abcdefg',
        firstName: 'John',
        middleName: 'Jay',
        lastName: 'Doe',
        email: 'jdoe@test.com',
        passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
        phone: '123-123-1234',
        company: 'Test Inc.',
        isTechnician: true,
      });
      newUser.save((err, newUser) => {
        if (err) {
          throw new Error(`Unable to save new user with error: ${err}`);
        } else {
          expect(newUser.email).to.equal('jdoe@test.com');
        }
      });
    });
  });

});