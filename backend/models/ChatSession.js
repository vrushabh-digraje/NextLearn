import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  parts: [
    {
      text: {
        type: String,
        required: true,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a student has only one persistent chat session per course
chatSessionSchema.index({ student: 1, course: 1 }, { unique: true });

chatSessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
