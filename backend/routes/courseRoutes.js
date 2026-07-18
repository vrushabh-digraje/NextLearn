import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getUserEnrollments,
  updateLessonProgress,
} from '../controllers/courseController.js';
import { protect, instructorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, instructorOnly, createCourse);

router.get('/my-enrollments', protect, getUserEnrollments);

router.get('/:id', getCourseById);
router.post('/:id/enroll', protect, enrollInCourse);
router.put('/:id/progress', protect, updateLessonProgress);

export default router;
