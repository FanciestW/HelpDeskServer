import { Document } from 'mongoose';

export interface ITask extends Document {
    taskId: string;
    title: string;
    description: string;
    subtasks: Array<string>;
    relatedCases: Array<string>;
    createdBy: string;
    priority: number;
    createdAt: Date;
    dueDate: Date;
}
