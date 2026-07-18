import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private/Public (Authenticated to check enrollment details)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Instructor only)
export const createCourse = async (req, res) => {
  const { title, description, category, thumbnailUrl, lessons, price } = req.body;

  try {
    const course = new Course({
      title,
      description,
      instructor: req.user._id,
      category: category || 'General',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      lessons: lessons || [],
      price: price !== undefined ? Number(price) : 999,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: req.user._id,
      course: courseId,
      completedLessons: [],
    });

    await enrollment.save();
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's enrollments
// @route   GET /api/courses/my-enrollments
// @access  Private
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' },
      });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/courses/:id/progress
// @access  Private
export const updateLessonProgress = async (req, res) => {
  const { lessonId, isCompleted } = req.body;
  const courseId = req.params.id;

  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    const lessonIndex = enrollment.completedLessons.indexOf(lessonId);

    if (isCompleted && lessonIndex === -1) {
      enrollment.completedLessons.push(lessonId);
    } else if (!isCompleted && lessonIndex !== -1) {
      enrollment.completedLessons.splice(lessonIndex, 1);
    }

    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.json({ message: 'Progress updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
