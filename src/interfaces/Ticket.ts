import { Document } from 'mongoose';

interface ITicket extends Document {
    ticketId: string;
    title: string;
    description: string;
    createdBy: string;
    assignedTo: string;
    status: string;
    priority: number;
    createdAt: Date;
}

export default ITicket;
