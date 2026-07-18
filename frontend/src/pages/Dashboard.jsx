import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { BookOpen, Award, CheckCircle, Clock, Plus, Loader, Layers, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Instructor-specific state
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    thumbnailUrl: '',
    price: 999,
    lessons: [{ title: '', videoUrl: '', textContent: '', duration: 5 }],
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    fetchEnrollments();
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...newCourse.lessons];
    updatedLessons[index][field] = value;
    setNewCourse({ ...newCourse, lessons: updatedLessons });
  };

  const addLessonField = () => {
    setNewCourse({
      ...newCourse,
      lessons: [...newCourse.lessons, { title: '', videoUrl: '', textContent: '', duration: 5 }],
    });
  };

  const removeLessonField = (index) => {
    const updatedLessons = newCourse.lessons.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, lessons: updatedLessons });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) {
      alert('Title and description are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        alert('Course created successfully!');
        setIsCreating(false);
        setNewCourse({
          title: '',
          description: '',
          category: '',
          thumbnailUrl: '',
          price: 999,
          lessons: [{ title: '', videoUrl: '', textContent: '', duration: 5 }],
        });
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create course');
      }
    } catch (err) {
      alert('Error creating course');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Loader size={36} className="animate-float" style={{ marginRight: '10px' }} />
        <span>Loading dashboard panel...</span>
      </div>
    );
  }

  // Calculate statistics
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => {
    const totalLessons = e.course?.lessons?.length || 0;
    return totalLessons > 0 && e.completedLessons.length === totalLessons;
  }).length;
  
  const totalCompletedLessons = enrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);

  return (
    <div style={{ padding: '0 40px 60px 40px' }} className="animate-slide-up">
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        padding: '24px 30px',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Welcome Back, {user.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            {user.role === 'instructor' ? 'Manage your syllabus and course schedules.' : 'Pick up where you left off in your courses.'}
          </p>
        </div>
        {user.role === 'instructor' && (
          <button 
            onClick={() => setIsCreating(!isCreating)} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} />
            {isCreating ? 'Close Syllabus Builder' : 'Create New Course'}
          </button>
        )}
      </div>

      {/* Instructor Mode: Create Course Panel */}
      {isCreating && user.role === 'instructor' && (
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers color="var(--primary)" size={24} /> Course Curriculum Builder
          </h2>
          <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="builder-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Course Title*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newCourse.title} 
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} 
                  placeholder="e.g. React & Node Fullstack Masterclass"
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newCourse.category} 
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} 
                  placeholder="e.g. Web Development, AI, Math"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Price Amount (₹)*</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={newCourse.price} 
                  onChange={e => setNewCourse({ ...newCourse, price: Number(e.target.value) })} 
                  placeholder="e.g. 999"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description*</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={newCourse.description} 
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} 
                placeholder="Brief summary introducing the course objective..."
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Thumbnail Image URL</label>
              <input 
                type="text" 
                className="form-input" 
                value={newCourse.thumbnailUrl} 
                onChange={e => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })} 
                placeholder="https://example.com/image.jpg (or leave blank for dynamic asset)"
              />
            </div>

            {/* Lesson Fields */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Course Lessons ({newCourse.lessons.length})</span>
                <button type="button" onClick={addLessonField} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Lesson
                </button>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {newCourse.lessons.map((lesson, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                    {newCourse.lessons.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeLessonField(idx)} 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '12px' }}>Lesson #{idx + 1}</h4>
                    <div className="builder-lesson-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Lesson Title*</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={lesson.title} 
                          onChange={e => handleLessonChange(idx, 'title', e.target.value)} 
                          placeholder="e.g. Introduction to React Hooks"
                          required
                        />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Duration (minutes)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={lesson.duration} 
                          onChange={e => handleLessonChange(idx, 'duration', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '10px' }}>
                      <div className="input-group" style={{ marginBottom: 10 }}>
                        <label className="input-label">Video URL (YouTube Embed or direct MP4 link)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={lesson.videoUrl} 
                          onChange={e => handleLessonChange(idx, 'videoUrl', e.target.value)} 
                          placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                        />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Lesson Text / Reading Content (Markdown compatible)</label>
                        <textarea 
                          className="form-input" 
                          rows="4" 
                          value={lesson.textContent} 
                          onChange={e => handleLessonChange(idx, 'textContent', e.target.value)} 
                          placeholder="Write key takeaways or code instructions here..."
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 30px' }}>
              Publish Course Catalog
            </button>
          </form>
        </div>
      )}

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '10px' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{totalCourses}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Enrolled Courses</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '10px' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{totalCompletedLessons}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lessons Completed</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '10px' }}>
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{completedCourses}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Completed Courses</p>
          </div>
        </div>
      </div>

      {/* Main Student Course Panel */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>My Learning Tracks</h2>
      
      {enrollments.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1rem', marginBottom: '20px' }}>You haven't enrolled in any courses yet!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Browse Course Catalog</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;
            const totalLessons = course.lessons?.length || 0;
            const progress = totalLessons > 0 ? (enrollment.completedLessons.length / totalLessons) * 100 : 0;
            
            return (
              <CourseCard
                key={enrollment._id}
                course={course}
                isEnrolled={true}
                progress={progress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
