import Mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import Ticket from '../../src/models/Ticket';
import User from '../../src/models/User';
import chai, { expect, assert } from 'chai';
chai.use(require('chai-as-promised'));

describe('Ticket Mongoose Model', function() {
  this.slow(1000);
  
  const fullDetailTicket = {
    ticketId: nanoid(),
    title: 'Test Ticket',
    description: 'Test this new ticket',
    assignedTo: '001',
    createdBy: '002',
    status: 'new',
    priority: 1,
  };

  before(async function() {
    await Mongoose.connect('mongodb://localhost:27017/helpdesktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await User.create({
      uid: '001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test.com',
      passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
      isTechnician: true,
    });
    await User.create({
      uid: '002',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@test.com',
      passwordDigest: '$2y$12$HY0krNFDnE.FKVPqqZgs2eeVyOUkY0eRaoOi8elHEDGYpdBB.0.MS',
      isTechnician: false,
    });
  });

  beforeEach(async function() {
    await Ticket.deleteMany({});
  });

  after(async function() {
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Mongoose.disconnect();
  });

  context('Valid Tickets', function() {
    it('Ticket With All Details', async function() {
      const ticket = await Ticket.create(fullDetailTicket);
      expect(ticket.assignedTo).to.be.equal('001');
      expect(ticket.createdBy).to.be.equal('002');
    });

    it('Un-assigned Ticket', async function() {
      const unassignedTicket = Object.assign({}, fullDetailTicket);
      delete unassignedTicket.assignedTo;
      const ticket = await Ticket.create(unassignedTicket);
      expect(ticket.assignedTo).to.not.exist;
    });
  });

  context('Invalid Tickets', function() {
    it('Ticket Assigned to Non-existance User', function() {
      const badTicket = Object.assign({}, fullDetailTicket, { assignedTo: '404' });
      return assert.isRejected(Ticket.create(badTicket), Mongoose.Error.ValidationError);
    });

    it('Ticket with no creator', function() {
      const noCreatorTicket = Object.assign({}, fullDetailTicket);
      delete noCreatorTicket.createdBy;
      return assert.isRejected(Ticket.create(noCreatorTicket), Mongoose.Error.ValidationError);
    });

    it('Ticket with duplicate ticketId', async function() {
      const ticketId = nanoid();
      const ticketDoc = Object.assign({}, fullDetailTicket, { ticketId, });
      await Ticket.create(ticketDoc);
      return assert.isRejected(Ticket.create(ticketDoc), /.*(duplicate key error).*/);
    });

    it('Ticket with no title', async function() {
      const ticketDoc = Object.assign({}, fullDetailTicket, {});
      delete ticketDoc.title;
      return assert.isRejected(Ticket.create(ticketDoc), /.*(`title` is required).*/);
    });
  });
});