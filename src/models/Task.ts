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
  title: { type: String, required: true, default: '' },
  description: { type: String, required: true, default: '' },
  subtasks: { type: [String], required: true, default: [] },
  relatedCases: { type: [String], required: true, default: [] },
  createdBy: {
    type: String,
    required: true,
    default: '',
    validate: {
      validator: validateUid,
      message: 'Invalid User',
    }
  },
  assignedTo: {
    type: String,
    required: true,
    default: '',
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
  createdAt: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true, default: Date.now },
});

TaskSchema.virtual('overdue', {
  type: Boolean,
}).get(() => {
  return Date.now > this.dueDate;
});

const Task: mongoose.Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
