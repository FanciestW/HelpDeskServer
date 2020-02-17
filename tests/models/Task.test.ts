import Mongoose from 'mongoose';
import uniqid from 'uniqid';
import Task from '../../src/models/Task';
import User from '../../src/models/User';
import Ticket from '../../src/models/Ticket';
import chai, { expect, assert } from 'chai';
chai.use(require('chai-as-promised'));

describe('Task Mongoose Model Test', function () {

  const validTask = {
    taskId: uniqid(),
    title: 'Unit Test',
    description: 'Write unit tests',
    relatedTickets: ['ticket001'],
    createdBy: 'user1',
    assignedTo: 'user1',
    priority: 0,
    dueDate: new Date().setDate(new Date().getDate() + 1),
  };

  before(async function () {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Task.deleteMany({});
    await new User({
      uid: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test.com',
      passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
      isTechnician: true,
    }).save();
    await new User({
      uid: 'user2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@test.com',
      passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
      isTechnician: false,
    }).save();
    await new Ticket({
      ticketId: 'ticket001',
      title: 'Test Ticket',
      assignedTo: 'user1',
      createdBy: 'user2',
    }).save();
  });

  beforeEach(async function () {
    await Task.deleteMany({});
  });

  after(async function() {
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Task.deleteMany({});
    await Mongoose.disconnect();
  });

  context('Valid Tasks', function() {
    it('Assigned Task with Related Ticket', async function() {
      const task = await new Task(validTask).save();
      expect(task.assignedTo).to.be.equal('user1');
      expect(task.createdAt.getDate()).to.be.equal((new Date().getDate()));
      expect(task.dueDate.getDate()).to.be.equal((new Date().getDate() + 1));
    });
  });

});

