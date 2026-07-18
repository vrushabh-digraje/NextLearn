import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  textContent: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    default: 5,
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
  },
  lessons: [lessonSchema],
  price: {
    type: Number,
    default: 999,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
