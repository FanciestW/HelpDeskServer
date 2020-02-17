import mongoose, { Schema } from 'mongoose';
import ITask from '../interfaces/Task';
import User from './User';

const validateUid = async (uid) => {
  if (uid === '') {
    return true;
  } else if (await User.count({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const TaskSchema: Schema = new Schema({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  subtasks: { type: [String], required: false, default: [] },
  relatedTickets: { type: [String], required: false, default: [] },
  createdBy: {
    type: String,
    required: true,
    validate: {
      validator: validateUid,
      message: 'Invalid User',
    }
  },
  assignedTo: {
    type: String,
    required: false,
    default: () => {
      if (this.createdBy) {
        return this.createdBy;
      } else {
        return null;
      }
    },
    validate: {
      validator: validateUid,
      message: 'Invalid User',
    }
  },
  priority: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (priority) => {
        return priority >= 0 && priority <= 5;
      },
      message: 'Priority must be in the range of 0 and 5',
    }
  },
  createdAt: { type: Date, required: false, default: Date.now },
  dueDate: { type: Date, required: false, default: Date.now },
});

TaskSchema.virtual('overdue', {
  type: Boolean,
}).get(() => {
  return Date.now > this.dueDate;
});

const Task: mongoose.Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
