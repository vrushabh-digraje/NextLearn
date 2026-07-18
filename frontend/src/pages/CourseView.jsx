import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';
import PaymentModal from '../components/PaymentModal';
import { API_BASE_URL } from '../config';
import { BookOpen, CheckCircle2, Circle, ArrowLeft, ArrowRight, Play, FileText, Check } from 'lucide-react';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    if (user && token) {
      fetchEnrollment();
    }
  }, [id, user, token]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);
      if (!response.ok) throw new Error('Course not found');
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const enrollments = await response.json();
        const activeEnrollment = enrollments.find((e) => e.course?._id === id);
        setEnrollment(activeEnrollment || null);
      }
    } catch (err) {
      console.error('Error fetching enrollment status:', err);
    }
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setIsPaymentModalOpen(false);
        fetchEnrollment();
      } else {
        const data = await response.json();
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      alert('Error enrolling in course');
    }
  };

  const toggleLessonProgress = async (lessonId, isCompleted) => {
    if (!enrollment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lessonId, isCompleted }),
      });
      const data = await response.json();
      if (response.ok) {
        setEnrollment(data.enrollment);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <div className="typing-indicator" style={{ display: 'flex', gap: '6px' }}>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const activeLesson = lessons[activeLessonIndex];
  const isEnrolled = !!enrollment;

  // Format Text Content (handle headings, lists, code)
  const formatTextContent = (text) => {
    if (!text) return <p style={{ color: 'var(--text-muted)' }}>No reading contents available for this lesson.</p>;
    
    // Split by newlines and render blocks
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h2 key={idx} style={{ fontSize: '1.5rem', margin: '20px 0 10px 0', fontFamily: 'var(--font-display)' }}>{line.substring(2)}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ fontSize: '1.25rem', margin: '18px 0 8px 0', fontFamily: 'var(--font-display)' }}>{line.substring(3)}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '6px', color: 'var(--text-secondary)' }}>{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '10px' }} />;
      }
      return <p key={idx} style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>{line}</p>;
    });
  };

  return (
    <div style={{ padding: '0 40px 60px 40px' }} className="animate-slide-up">
      {/* Detail Preview Panel (Non-Enrolled Users) */}
      {!isEnrolled ? (
        <div className="glass-panel animate-slide-up course-details-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '40px',
          padding: '40px',
          borderRadius: 'var(--border-radius-lg)',
          marginTop: '20px'
        }}>
          <div>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '20px', padding: '6px 12px', fontSize: '0.8rem' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <span style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--primary)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>{course.category}</span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '12px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              {course.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div>Lessons: <strong>{lessons.length}</strong></div>
              <div>Duration: <strong>{lessons.reduce((acc, curr) => acc + (curr.duration || 5), 0)} mins</strong></div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', height: '220px', border: '1px solid var(--border-color)' }}>
              <img
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              margin: '10px 0'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Course Price:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>₹{course.price || 999}</span>
            </div>

            <button onClick={handleEnroll} className="btn btn-primary" style={{ padding: '14px', width: '100%', fontSize: '1rem' }}>
              Enroll in Syllabus
            </button>
          </div>
        </div>
      ) : (
        /* Immersive Split Course Room (Enrolled Users) */
        <div className="course-study-room" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', marginTop: '20px' }}>
          
          {/* Sidebar Navigation */}
          <div className="glass-panel" style={{ padding: '20px', height: 'calc(100vh - 180px)', overflowY: 'auto', position: 'sticky', top: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <BookOpen size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course Syllabus</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lessons.map((lesson, index) => {
                const isCompleted = enrollment?.completedLessons.includes(lesson._id);
                const isActive = index === activeLessonIndex;

                return (
                  <button
                    key={lesson._id}
                    onClick={() => setActiveLessonIndex(index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--border-radius-sm)',
                      background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isCompleted ? (
                        <CheckCircle2 size={16} color="var(--success)" />
                      ) : (
                        <Circle size={16} color="var(--text-muted)" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: isActive ? '600' : '400', lineHeight: '1.3' }}>{lesson.title}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration || 5} min</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Stage Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Header with quick navigation and completion button */}
            <div className="glass-panel" style={{
              padding: '20px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginBottom: '4px' }}
                >
                  <ArrowLeft size={12} /> Dashboard
                </button>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                  {activeLesson?.title || 'No lessons published'}
                </h2>
              </div>

              {activeLesson && (
                <button
                  onClick={() => {
                    const isCompleted = enrollment?.completedLessons.includes(activeLesson._id);
                    toggleLessonProgress(activeLesson._id, !isCompleted);
                  }}
                  className={`btn ${enrollment?.completedLessons.includes(activeLesson._id) ? 'btn-secondary' : 'btn-primary'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: enrollment?.completedLessons.includes(activeLesson._id) ? 'var(--success)' : 'transparent',
                    color: enrollment?.completedLessons.includes(activeLesson._id) ? 'var(--success)' : 'white'
                  }}
                >
                  {enrollment?.completedLessons.includes(activeLesson._id) ? (
                    <>
                      <Check size={16} /> Completed
                    </>
                  ) : (
                    'Mark as Finished'
                  )}
                </button>
              )}
            </div>

            {/* Video Stage Panel */}
            {activeLesson && (
              <div className="glass-panel" style={{ overflow: 'hidden', padding: '0px', borderRadius: 'var(--border-radius-md)' }}>
                {activeLesson.videoUrl ? (
                  <div>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        title={activeLesson.title}
                        src={activeLesson.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                    {/* Fallback Direct Link Helper */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(193, 154, 107, 0.08)',
                      borderTop: '1px solid rgba(193, 154, 107, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        🎥 Video playback blocked or not loading?
                      </span>
                      <a 
                        href={activeLesson.videoUrl.replace('embed/', 'watch?v=')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent)',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Watch directly on YouTube ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: '250px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    gap: '10px'
                  }}>
                    <Play size={36} color="rgba(255,255,255,0.1)" />
                    <span style={{ fontSize: '0.85rem' }}>No video tutorial attached to this lesson</span>
                  </div>
                )}
              </div>
            )}

            {/* Reading Content Stage */}
            {activeLesson && (
              <div className="glass-panel" style={{ padding: '30px 40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <FileText size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Reading Material</h3>
                </div>
                <div>
                  {formatTextContent(activeLesson.textContent)}
                </div>
              </div>
            )}

            {/* Lesson Pagination Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                disabled={activeLessonIndex === 0}
                onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: activeLessonIndex === 0 ? 0.4 : 1, cursor: activeLessonIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ArrowLeft size={16} /> Previous Lesson
              </button>
              
              <button
                disabled={activeLessonIndex === lessons.length - 1}
                onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: activeLessonIndex === lessons.length - 1 ? 0.4 : 1, cursor: activeLessonIndex === lessons.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                Next Lesson <ArrowRight size={16} />
              </button>
            </div>
            
            {/* Embedded Floating AI Chatbot */}
            <ChatWidget courseId={id} lessonId={activeLesson?._id} />

          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseView;
