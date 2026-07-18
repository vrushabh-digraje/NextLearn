import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import { 
  Search, Globe, Terminal, Database, Shield, 
  BookOpen, AlertCircle, Star 
} from 'lucide-react';

const getCategoryIcon = (category) => {
  const c = category.toLowerCase();
  if (c.includes('web')) return <Globe size={18} />;
  if (c.includes('data')) return <Database size={18} />;
  if (c.includes('intel') || c.includes('ai')) return <Terminal size={18} />;
  if (c.includes('cyber') || c.includes('security')) return <Shield size={18} />;
  return <BookOpen size={18} />;
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearchQuery(s);
  }, [searchParams]);
  
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    if (user && token) {
      fetchMyEnrollments();
    }
  }, [user, token]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/courses');
      if (!response.ok) throw new Error('Failed to load courses');
      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch course catalog. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses/my-enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyEnrollments(data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const handleEnroll = (courseId) => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    const courseToBuy = courses.find(c => c._id === courseId);
    if (courseToBuy) {
      setSelectedCourseForPayment(courseToBuy);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedCourseForPayment) return;
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourseForPayment._id}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setIsPaymentModalOpen(false);
        setSelectedCourseForPayment(null);
        fetchMyEnrollments();
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    }
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  // Filter logic matching the 4 primary categories
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') {
      return matchesSearch;
    }
    return course.category.toLowerCase() === activeCategory.toLowerCase() && matchesSearch;
  });

  const categories = [
    { name: 'All', label: 'All Catalog' },
    { name: 'Web Development', label: 'Web Development' },
    { name: 'Data Science', label: 'Data Science' },
    { name: 'Artificial Intelligence', label: 'AI Engineering' },
    { name: 'Cybersecurity', label: 'Cybersecurity' }
  ];

  return (
    <div style={{ padding: '40px 12px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Course Catalog
        </span>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', marginTop: '6px', color: 'var(--primary)' }}>
          {activeCategory === 'All' ? 'Explore all pathways' : activeCategory}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Acquire real skills through video lectures, clean syllabuses, and interactive code debugging.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        
        {/* Left Sidebar Category Filter */}
        <aside className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'sticky',
          top: '100px'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
            Filter Categories
          </span>
          
          {categories.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.9rem',
                  transition: 'var(--transition-smooth)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 66, 37, 0.15)' : 'none'
                }}
                className={isSelected ? '' : 'dropdown-item-hover'}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Search Box */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 16px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--border-color)',
            gap: '12px'
          }}>
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search pathways, concepts, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                padding: '12px 0',
                fontSize: '0.95rem',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Loader Stage */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="typing-indicator" style={{ justifyContent: 'center' }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', color: 'var(--danger)' }}>
              <AlertCircle size={24} />
              <span>{error}</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>No courses found</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>Try refining your search term or selecting another study channel.</p>
            </div>
          ) : (
            /* Catalog Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }} className="animate-slide-up">
              {filteredCourses.map((course) => {
                const enrollment = myEnrollments.find(e => e.courseId === course._id);
                const isEnrolled = !!enrollment;
                const progress = enrollment ? enrollment.progress : 0;
                
                // Extract ratings statistics safely
                const rating = course.rating || 4.8;
                const count = course.reviewCount || 120;

                return (
                  <div key={course._id} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                      background: 'rgba(255, 255, 255, 0.9)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      border: '1px solid var(--border-color)',
                      color: '#d97706'
                    }}>
                      <Star size={12} fill="#d97706" color="#d97706" />
                      <span>{rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({count})</span>
                    </div>
                    <CourseCard
                      course={course}
                      isEnrolled={isEnrolled}
                      progress={progress}
                      onEnroll={handleEnroll}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={selectedCourseForPayment}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Courses;
