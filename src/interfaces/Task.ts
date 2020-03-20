import { Document } from 'mongoose';

interface ITask extends Document {
    taskId: string;
    title: string;
    description: string;
    subtasks: Array<string>;
    relatedTickets: Array<string>;
    createdBy: string;
    assignedTo: string;
    status: string;
    priority: number;
    createdAt: Date;
    dueDate: Date;
}

export default ITask;
