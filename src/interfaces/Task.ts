import { Document } from 'mongoose';

interface ITask extends Document {
    taskId: string;
    title: string;
    description: string;
    subtasks: Array<string>;
    relatedCases: Array<string>;
    createdBy: string;
    assignedTo: string;
    priority: number;
    createdAt: Date;
    dueDate: Date;
}

export default ITask;
