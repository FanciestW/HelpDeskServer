import mongoose, { Schema } from 'mongoose';
import ITask from '../interfaces/Task';
import User from './User';

const allowedStatuses = ['new', 'pending', 'started', 'in progress', 'done', 'deleted', 'archived'];

export const TaskSchema: Schema<ITask> = new Schema<ITask>({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  subtasks: { type: [String], required: false, default: [] },
  relatedTickets: { type: [String], required: false, default: [] },
  createdBy: {
    type: String,
    required: true,
    validate: {
      validator: async (uid: string) => {
        if (await User.countDocuments({ uid, }) > 0) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid createdBy User',
    }
  },
  assignedTo: {
    type: String,
    required: false,
    validate: {
      validator: async (uid: string) => {
        if (uid === '' || await User.countDocuments({ uid, }) > 0) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid assignedTo User',
    }
  },
  status: {
    type: String,
    required: true,
    default: 'new',
    validate: {
      validator: (stat) => {
        if (allowedStatuses.includes(stat)) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid Status',
    }
  },
  priority: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (priority: number) => {
        return priority >= 0 && priority <= 5;
      },
      message: 'Priority must be in the range of 0 and 5',
    }
  },
  createdAt: { type: Date, required: false, default: Date.now },
  dueDate: { type: Date, required: false, default: Date.now },
});

TaskSchema.pre('save', function (next) {
  if (this.get('createdBy')) {
    this.set({ assignedTo: this.get('createdBy') });
  }
  next();
});

TaskSchema.virtual('overdue', {
  type: Boolean,
}).get(function() {
  return Date.now > this.dueDate;
});

const Task: mongoose.Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
