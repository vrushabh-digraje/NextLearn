import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Tag } from 'lucide-react';

const CourseCard = ({ course, isEnrolled, progress, onEnroll }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="course-thumbnail"
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'var(--primary)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Tag size={12} />
          {course.category}
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
          {course.title}
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          lineHeight: '1.4',
          marginBottom: '16px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.description}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="var(--accent)" />
            <span><strong>{course.instructor?.name || 'Academic Staff'}</strong></span>
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)'
          }}>
            ₹{course.price || 999}
          </div>
        </div>

        {isEnrolled ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--gradient-primary)',
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{ width: '100%' }}>
              Resume Learning
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/courses/${course._id}`} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>
              View Details
            </Link>
            <button onClick={() => onEnroll(course._id)} className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>
              Enroll Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
