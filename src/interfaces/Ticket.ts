import { Document } from 'mongoose';

export interface ITicket extends Document {
    ticketId: string;
    title: string;
    description: string;
    createdBy: string;
    assignedTo: string;
    status: string;
    priority: number;
    createdAt: Date;
}
