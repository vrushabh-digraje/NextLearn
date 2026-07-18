import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  BookOpen, Sparkles, Search, 
  ChevronDown, ChevronUp, Star, Globe, Terminal, Palette, 
  Database, Shield, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// Helper to resolve category icons dynamically
const getCategoryIcon = (category) => {
  const c = category.toLowerCase();
  if (c.includes('web')) return <Globe size={18} />;
  if (c.includes('program') || c.includes('code')) return <Terminal size={18} />;
  if (c.includes('design') || c.includes('ui')) return <Palette size={18} />;
  if (c.includes('data') || c.includes('sql') || c.includes('visualization')) return <Database size={18} />;
  if (c.includes('cyber') || c.includes('security')) return <Shield size={18} />;
  return <BookOpen size={18} />;
};

// Helper to resolve category covers dynamically
const getCategoryThumbnail = (category) => {
  const c = category.toLowerCase();
  if (c.includes('web')) return '/cat_web_dev.png';
  if (c.includes('data')) return '/cat_data_science.png';
  if (c.includes('intel') || c.includes('ai')) return '/cat_ai.png';
  if (c.includes('cyber') || c.includes('security')) return '/cat_cyber.png';
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';
};

// Live, Interactive Dashboard Mockup built with React and SVG charts matching the reference mockup
const InteractiveDashboardMockup = () => {
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG Chart points depending on active metric
  const chartsData = {
    revenue: {
      path: "M 10 70 C 60 50, 80 80, 120 40 C 160 20, 200 90, 240 30 C 280 10, 300 60, 330 15",
      points: [
        { x: 10, y: 70, label: "Apr", val: "$20k" },
        { x: 60, y: 55, label: "May", val: "$45k" },
        { x: 120, y: 40, label: "Jun", val: "$35k" },
        { x: 180, y: 60, label: "Jul", val: "$40k" },
        { x: 240, y: 30, label: "Aug", val: "$60k" },
        { x: 300, y: 45, label: "Sep", val: "$50k" },
        { x: 330, y: 15, label: "Oct", val: "$75k" }
      ],
      color: "#a855f7"
    },
    enrollments: {
      path: "M 10 80 Q 50 65 90 30 T 170 50 T 250 20 T 320 40",
      points: [
        { x: 10, y: 80, label: "Apr", val: "120" },
        { x: 50, y: 65, label: "May", val: "155" },
        { x: 90, y: 30, label: "Jun", val: "220" },
        { x: 130, y: 45, label: "Jul", val: "180" },
        { x: 170, y: 50, label: "Aug", val: "175" },
        { x: 210, y: 35, label: "Sep", val: "210" },
        { x: 250, y: 20, label: "Oct", val: "245" },
        { x: 290, y: 55, label: "Nov", val: "160" },
        { x: 330, y: 40, label: "Dec", val: "195" }
      ],
      color: "#10b981"
    },
    students: {
      path: "M 10 50 Q 50 40 90 55 T 170 30 T 250 15 T 320 25",
      points: [
        { x: 10, y: 50, label: "Apr", val: "4.1k" },
        { x: 50, y: 40, label: "May", val: "4.3k" },
        { x: 90, y: 55, label: "Jun", val: "4.2k" },
        { x: 130, y: 35, label: "Jul", val: "4.5k" },
        { x: 170, y: 30, label: "Aug", val: "4.6k" },
        { x: 210, y: 40, label: "Sep", val: "4.5k" },
        { x: 250, y: 15, label: "Oct", val: "4.8k" },
        { x: 290, y: 30, label: "Nov", val: "4.7k" },
        { x: 330, y: 25, label: "Dec", val: "4.9k" }
      ],
      color: "#c19a6b"
    }
  };

  const currentChart = chartsData[activeMetric] || chartsData.revenue;

  return (
    <div style={{
      width: '100%',
      maxWidth: '560px',
      background: '#f8fafc',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      fontSize: '11px',
      color: '#334155',
      overflow: 'hidden',
      height: '430px',
      userSelect: 'none',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Left Navigation Sidebar */}
      <div style={{
        width: '54px',
        borderRight: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        gap: '20px'
      }}>
        {/* Logo lightning bolt */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '800',
          fontSize: '14px',
          marginBottom: '24px'
        }}>
          ⚡
        </div>
        {/* Navigation Items */}
        {['home', 'catalog', 'wallet', 'stats', 'graph', 'settings'].map((item, idx) => (
          <div 
            key={item} 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: idx === 0 ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
              color: idx === 0 ? '#a855f7' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {item === 'home' && <Globe size={15} />}
            {item === 'catalog' && <BookOpen size={15} />}
            {item === 'wallet' && <Star size={15} />}
            {item === 'stats' && <Terminal size={15} />}
            {item === 'graph' && <Palette size={15} />}
            {item === 'settings' && <Shield size={15} />}
          </div>
        ))}
      </div>

      {/* Main Panel Content */}
      <div style={{
        flex: 1,
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', marginRight: '2px' }}>⚡</span>
            <span style={{ fontWeight: '800', fontSize: '12px', letterSpacing: '0.5px' }}>CREATOR HUB</span>
          </div>
          {/* Avatar and notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>🔔</span>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            </div>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#a855f7', border: '1.5px solid #ffffff', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#c19a6b', display: 'flex', alignItems: 'center', justifySelf: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '10px', justifyContent: 'center' }}>CH</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Dashboard</h4>
        </div>

        {/* 4 Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {/* Revenue Metric (Gradient Card) */}
          <div 
            onClick={() => setActiveMetric('revenue')}
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ opacity: 0.85, fontSize: '7.5px', fontWeight: '500' }}>Total Revenue</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 3px', borderRadius: '4px', fontSize: '7px' }}>+12.5%</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', display: 'block', margin: '4px 0 2px 0' }}>$142,560</span>
            {/* Sparkline in Card */}
            <svg viewBox="0 0 80 20" style={{ width: '100%', height: '14px', overflow: 'visible' }}>
              <path d="M 0 15 Q 20 5 40 12 T 80 2" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Enrollments Metric */}
          <div 
            onClick={() => setActiveMetric('enrollments')}
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '7.5px' }}>New Enrollments</span>
              <span style={{ color: '#10b981', fontSize: '7px', fontWeight: '700' }}>+8.2% ↑</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', display: 'block', margin: '4px 0 2px 0' }}>1,345</span>
            {/* Micro bars */}
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '14px' }}>
              <div style={{ width: '5px', height: '6px', background: '#3b82f6', borderRadius: '1px' }} />
              <div style={{ width: '5px', height: '10px', background: '#10b981', borderRadius: '1px' }} />
              <div style={{ width: '5px', height: '8px', background: '#a855f7', borderRadius: '1px' }} />
              <div style={{ width: '5px', height: '12px', background: '#ec4899', borderRadius: '1px' }} />
              <div style={{ width: '5px', height: '7px', background: '#c19a6b', borderRadius: '1px' }} />
            </div>
          </div>

          {/* Students Metric */}
          <div 
            onClick={() => setActiveMetric('students')}
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ color: '#64748b', fontSize: '7.5px', display: 'block' }}>Active Students</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', display: 'block', margin: '4px 0 2px 0' }}>4,890</span>
            {/* Tiny overlapping profile circles */}
            <div style={{ display: 'flex', position: 'relative', height: '14px', marginTop: '4px' }}>
              {['#3b82f6', '#10b981', '#a855f7', '#ec4899'].map((col, i) => (
                <div 
                  key={i} 
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: col,
                    border: '1px solid #ffffff',
                    position: 'absolute',
                    left: `${i * 8}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  {['S', 'M', 'A', 'D'][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Course Sales Metric */}
          <div 
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              textAlign: 'left'
            }}
          >
            <span style={{ color: '#64748b', fontSize: '7.5px', display: 'block' }}>Course Sales</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>87%</span>
              <svg viewBox="0 0 36 36" style={{ width: '18px', height: '18px' }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="100" strokeDashoffset="13" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Live SVG Chart Panel (Course Sales Analytics) */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '12px',
          background: '#ffffff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '10px', color: '#0f172a' }}>Course Sales Analytics (Last 30 Days)</span>
            {hoveredPoint !== null && (
              <span style={{
                background: currentChart.color,
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '8px',
                fontWeight: '700'
              }}>
                {currentChart.points[hoveredPoint].label}: {currentChart.points[hoveredPoint].val}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#64748b', marginBottom: '4px' }}>
            <span>$150k</span>
            <span>$120k</span>
            <span>$80k</span>
            <span>$50k</span>
          </div>

          {/* Chart SVG */}
          <svg viewBox="0 0 340 100" style={{ width: '100%', height: '80px', overflow: 'visible' }}>
            <line x1="0" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="50" x2="340" y2="50" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="80" x2="340" y2="80" stroke="#f1f5f9" strokeWidth="1" />

            <path 
              d={currentChart.path} 
              fill="none" 
              stroke={currentChart.color} 
              strokeWidth="2.5" 
              strokeLinecap="round"
              style={{ transition: 'd 0.5s ease, stroke 0.5s ease' }}
            />

            {currentChart.points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === idx ? 5 : 3.5}
                fill={hoveredPoint === idx ? '#ffffff' : currentChart.color}
                stroke={currentChart.color}
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* Bottom Split Pane: Top Selling & Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '8px',
          textAlign: 'left'
        }}>
          {/* Top Selling Courses */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px',
            background: '#ffffff'
          }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '9px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>Top Selling Courses</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { title: 'Mastering UI Design', sales: '350 enrollments', amount: '$45k', color: '#a855f7' },
                { title: 'Advanced Vector Art', sales: '280 enrollments', amount: '#32k', color: '#3b82f6' },
                { title: 'Content Creation Fundamentals', sales: '220 enrollments', amount: '$28k', color: '#ec4899' },
                { title: 'Freelancing Guide', sales: '120 enrollments', amount: '$15k', color: '#c19a6b' }
              ].map((c, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color }} />
                    <div>
                      <span style={{ fontWeight: '700', color: '#334155', display: 'block' }}>{c.title}</span>
                      <span style={{ color: '#94a3b8', fontSize: '7px' }}>{c.sales}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{c.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px',
            background: '#ffffff'
          }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '9px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>Recent Activity</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '7.5px' }}>
              {[
                { name: 'Sarah Jenkins', action: 'Enrolled in Mastering UI Design', date: 'Apr 20, 2023' },
                { name: 'Mike Chen', action: 'Purchased Advanced Vector Art', date: 'Jun 25, 2023' },
                { name: 'Anita Patel', action: 'Completed Content Creation Course', date: 'Sep 25, 2023' }
              ].map((act, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#0f172a' }}>{act.name}</strong>
                    <span style={{ color: '#94a3b8', fontSize: '6.5px' }}>{act.date}</span>
                  </div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '7px', marginTop: '2px' }}>{act.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Student Study Goals & Progress Planner States
  const [studyHours, setStudyHours] = useState(10);
  const [targetWeeks, setTargetWeeks] = useState(8);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (!response.ok) throw new Error('Failed to load courses');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        throw new Error('Invalid course list response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = () => {
    if (!user) {
      navigate('/auth?mode=register');
      return;
    }
    setShowSubscriptionSuccess(true);
  };

  // Restrict to exactly four main categories on Home
  const mainCategoriesList = [
    'Web Development',
    'Data Science',
    'Artificial Intelligence',
    'Cybersecurity'
  ];

  const getCategoryDetails = () => {
    const counts = {};
    if (Array.isArray(courses)) {
      counts['Web Development'] = courses.filter(c => c.category === 'Web Development').length;
      counts['Data Science'] = courses.filter(c => c.category === 'Data Science').length;
      counts['Artificial Intelligence'] = courses.filter(c => c.category === 'Artificial Intelligence').length;
      counts['Cybersecurity'] = courses.filter(c => c.category === 'Cybersecurity').length;
    }
    
    return mainCategoriesList.map(name => ({
      name,
      count: counts[name] || 0
    }));
  };

  const categoryList = getCategoryDetails();

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Calculate total study time commitment
const totalStudyHours = studyHours * targetWeeks;

  const faqs = [
    {
      q: "What courses are hosted on NextLearn?",
      a: "We host verified, comprehensive curriculum tracks in Web Development, Data Science, Artificial Intelligence, and Cybersecurity mapped step-by-step with lessons and video materials."
    },
    {
      q: "How does the weekly progress planner help my study?",
      a: "By adjusting your weekly hours and course duration targets, you can map out your educational investment. Using our context-aware personalized tutor accelerates concept retention by up to 40%."
    },
    {
      q: "How does the Study Buddy assist my learning?",
      a: "The Study Buddy is a helper built directly into the course view. Unlike standard search bars, it reads the active lesson text to explain code blocks, clarify theory, and test you with customized quizzes."
    }
  ];

  return (
    <div style={{ padding: '0 12px 60px 12px', maxWidth: '1400px', margin: '0 auto' }} className="animate-slide-up">
      
      {/* Checkout Success Modal Overlay */}
      {showSubscriptionSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px 32px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              background: 'rgba(0, 86, 210, 0.08)',
              color: 'var(--primary)',
              padding: '16px',
              borderRadius: '50%',
              display: 'flex'
            }}>
              <Award size={36} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>Premium Access Activated!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Your premium learning account is active! Start exploring structured syllabus pathways and utilizing your personalized Study Buddy.
            </p>
            <button 
              onClick={() => {
                setShowSubscriptionSuccess(false);
                const catalogSection = document.getElementById('catalog-section');
                catalogSection?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Start Exploring Catalog
            </button>
          </div>
        </div>
      )}

      {/* Student-Centric Two-Column Hero */}
      <section className="hero-section" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center',
        padding: '60px 0 40px 0',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Left Column: Headline and CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
          <div style={{
            background: 'rgba(37, 99, 235, 0.08)',
            color: 'var(--primary)',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            alignSelf: 'flex-start'
          }}>
            <Sparkles size={14} color="#d97706" />
            Structured Learning Pathways
          </div>

          <h1 style={{
            fontSize: '3.6rem',
            lineHeight: '1.1',
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            color: 'var(--text-primary)'
          }}>
            Master new tech skills with the power of <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Smart Tutoring</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            lineHeight: '1.5',
            maxWidth: '580px'
          }}>
            Access verified curriculums, follow structured lesson paths, and query your context-aware Study Buddy to explain code scripts and clear roadblocks.
          </p>

          {/* Interactive Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
            }}
            style={{ position: 'relative', width: '100%', maxWidth: '480px' }}
          >
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, categories, or topics..."
              style={{
                padding: '14px 20px 14px 46px',
                borderRadius: '30px',
                background: 'rgba(255,255,255,0.85)',
                fontSize: '0.95rem',
                width: '100%'
              }}
            />
            <Search size={18} color="var(--text-muted)" style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
          </form>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleStartTrial} className="btn btn-primary" style={{ padding: '12px 26px' }}>
              Start Learning Free
            </button>
            <button 
              onClick={() => {
                const calcSection = document.getElementById('calculator-section');
                calcSection?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="btn btn-secondary" 
              style={{ padding: '12px 26px' }}
            >
              Goal Planner
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Project Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(193, 154, 107, 0.2) 0%, rgba(0, 66, 37, 0.1) 100%)',
            filter: 'blur(80px)',
            borderRadius: '50%',
            top: '20px',
            zIndex: 0
          }} />
          
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'visible',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1,
            maxWidth: '440px',
            cursor: 'pointer'
          }}>
            {/* The Illustration Image */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 66, 37, 0.15)',
              border: '1px solid rgba(193, 154, 107, 0.2)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(193, 154, 107, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 66, 37, 0.15)';
            }}
            >
              <img 
                src="/lms_student_study.png" 
                alt="Interactive Study Illustration" 
                style={{ 
                  width: '100%', 
                  display: 'block'
                }}
              />
            </div>

            {/* Floating Glassmorphic Pill 1: AI Study Buddy */}
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '-20px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(193, 154, 107, 0.3)',
              borderRadius: '30px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: 'var(--primary)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'float 6s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
              e.currentTarget.style.background = '#faf9f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            }}
            >
              <Sparkles size={16} color="#c19a6b" />
              <span>Study Buddy</span>
            </div>

            {/* Floating Glassmorphic Pill 2: Courses Count */}
            <div style={{
              position: 'absolute',
              bottom: '40px',
              right: '-20px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 66, 37, 0.2)',
              borderRadius: '30px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: 'var(--primary)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'float-reverse 6s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
              e.currentTarget.style.background = '#faf9f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            }}
            >
              <BookOpen size={16} color="var(--primary)" />
              <span>100+ Syllabuses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Student Study Goals & Progress Planner */}
      <section id="calculator-section" style={{
        marginTop: '80px',
        scrollMarginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Interactive Goal Planner
          </span>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginTop: '6px' }}>Plan your weekly study targets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Adjust the sliders below to calculate your estimated total study hours.
          </p>
        </div>

        <div className="glass-panel planner-container-grid" style={{
          padding: '40px',
          width: '100%',
          maxWidth: '700px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Sliders Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                <span>Weekly Study Hours</span>
                <span style={{ color: 'var(--primary)' }}>{studyHours} hrs / week</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="40" 
                step="1"
                value={studyHours}
                onChange={e => setStudyHours(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>2 hrs</span>
                <span>40 hrs</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                <span>Course Program Duration</span>
                <span style={{ color: 'var(--primary)' }}>{targetWeeks} weeks</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="24" 
                step="1"
                value={targetWeeks}
                onChange={e => setTargetWeeks(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>2 weeks</span>
                <span>24 weeks</span>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 86, 210, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)',
            padding: '24px',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(0, 86, 210, 0.08)',
              color: 'var(--primary)',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex'
            }}>
              <BookOpen size={20} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Study Investment
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--primary)' }}>
              {totalStudyHours} hrs
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              expected study commitment
            </span>
          </div>
        </div>
      </section>

      {/* Stately Platform Statistics Board */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        maxWidth: '1000px',
        margin: '60px auto 20px auto',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>100+</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px', display: 'block' }}>Premium Syllabuses</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>Verified curriculum tracks in major software engineering categories.</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>10+</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px', display: 'block' }}>Academic Experts</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>Step-by-step videos and reading material mapped by lead specialists.</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>24/7</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px', display: 'block' }}>Tutor Support</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>Context-aware chat study buddy attached inside every lesson interface.</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-md)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>98.4%</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px', display: 'block' }}>Student Success</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>Unmatched progression and concept completion tracking rates.</p>
        </div>
      </section>

      {/* Main Display Catalog Stage */}
      <section id="catalog-section" style={{ marginTop: '80px', scrollMarginTop: '100px' }}>
        <div className="animate-slide-up">
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: '8px', color: 'var(--primary)' }}>
            Explore our curriculum paths
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '32px' }}>
            Click on any category to view its specialized syllabuses and start learning.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px',
            maxWidth: '1300px',
            margin: '0 auto'
          }}>
            {categoryList.map((cat) => {
              const isHovered = hoveredCategory === cat.name;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                  className="category-card"
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    height: '420px',
                    boxShadow: isHovered 
                      ? '0 20px 40px rgba(0, 66, 37, 0.25)' 
                      : '0 10px 30px rgba(0, 0, 0, 0.15)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Image Background */}
                  <img 
                    src={getCategoryThumbnail(cat.name)} 
                    alt={cat.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isHovered ? 'brightness(0.75) contrast(1.05)' : 'brightness(0.9) contrast(1)',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                  />

                  {/* Dark Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0) 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Floating Icon Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: isHovered ? 'var(--primary)' : 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: isHovered ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 2
                  }}>
                    {getCategoryIcon(cat.name)}
                  </div>

                  {/* Floating Interactive Explore Pill Button (reveals on hover in center) */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: isHovered ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -40%) scale(0.8)',
                    opacity: isHovered ? 1 : 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--primary)',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 3,
                    pointerEvents: 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    Explore Path <span style={{
                      transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                      transition: 'transform 0.3s ease'
                    }}>→</span>
                  </div>

                  {/* Content Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    textAlign: 'left',
                    zIndex: 2
                  }}>
                    <h3 style={{
                      fontSize: '1.45rem',
                      fontWeight: '800',
                      fontFamily: 'var(--font-display)',
                      margin: 0,
                      color: '#ffffff',
                      letterSpacing: '-0.3px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>{cat.name === 'Artificial Intelligence' ? 'AI Engineering' : cat.name}</h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}>
                        {cat.count} {cat.count === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '30px',
        maxWidth: '1000px',
        margin: '80px auto 40px auto',
        padding: '40px',
        borderRadius: 'var(--border-radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            background: 'rgba(0, 86, 210, 0.08)',
            color: 'var(--primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Manage Roster</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
              Instructors can build custom syllabus modules, update video URLs, and edit reading guides.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            background: 'rgba(0, 86, 210, 0.08)',
            color: 'var(--primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Integrated Syllabus</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
              Clean, modular paths mapping completed lessons and checking progress.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            background: 'rgba(0, 86, 210, 0.08)',
            color: 'var(--primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Study Buddy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
              Persistent, context-aware tutor residing in all lesson rooms to review code and draft summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Stately Learner Testimonials Grid */}
      <section style={{
        marginTop: '80px',
        maxWidth: '1000px',
        margin: '80px auto 40px auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Student Testimonials
          </span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', marginTop: '6px' }}>What our learners are saying</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Hear from students who accelerated their career transition using NextLearn.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', fontStyle: 'italic', flex: '1' }}>
              "The context-aware Study Buddy solved my coding bug in seconds. I've finished 3 course paths already! Highly recommend the weekly study goal planner too."
            </p>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>Sarah Jenkins</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web Development Student</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', fontStyle: 'italic', flex: '1' }}>
              "NextLearn allows me to map out syllabus modules easily. The student progress tracking is very clean, and my students love the interactive lesson chatbot."
            </p>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>David Vance</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data Science Instructor</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', fontStyle: 'italic', flex: '1' }}>
              "I transitioned into cybersecurity in just 3 months. The structured checklist of video lectures combined with the 24/7 tutor gave me the confidence to pass my certifications."
            </p>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>Marcus Chen</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cybersecurity Graduate</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Dropdown Accordions */}
      <section style={{
        maxWidth: '750px',
        margin: '60px auto 40px auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Everything you need to know about the NextLearn study system.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--border-radius-sm)',
                  overflow: 'hidden',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>
                
                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    animation: 'slideUp 0.25s ease-out'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
