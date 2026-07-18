import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  GraduationCap, LogOut, LayoutDashboard, User as UserIcon, 
  ChevronDown, Globe, Terminal, Database, Shield, BookOpen 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Interactive States
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Monitor page scroll to shrink Navbar and increase blur opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/');
  };

  const handleCategoryClick = (categoryName) => {
    setShowCatalog(false);
    navigate(`/courses?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <nav className="glass-panel" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isScrolled ? '12px 40px' : '18px 40px',
      margin: '0',
      width: '100%',
      borderRadius: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-surface)',
      borderWidth: '0 0 1px 0',
      borderStyle: 'solid',
      borderColor: 'var(--border-color)',
      boxShadow: isScrolled ? '0 10px 25px -5px rgba(0, 66, 37, 0.05)' : 'var(--glass-shadow)',
      transition: 'var(--transition-smooth)'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        color: 'var(--text-primary)'
      }} onClick={() => navigate('/')}>
        <div style={{
          background: 'var(--gradient-primary)',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <GraduationCap size={24} color="white" />
        </div>
        <div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            fontFamily: 'var(--font-display)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>NextLearn</span>
        </div>
      </Link>

      {/* Nav Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Interactive Explore Catalog Dropdown */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowCatalog(true)}
          onMouseLeave={() => setShowCatalog(false)}
        >
          <button style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '6px 0'
          }} className="nav-link">
            Explore <ChevronDown size={14} style={{ transform: showCatalog ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'var(--transition-smooth)' }} />
          </button>

          {/* Catalog Hover Card Dropdown */}
          {showCatalog && (
            <div className="glass-panel animate-slide-up" style={{
              position: 'absolute',
              top: '100%',
              left: '-20px',
              width: '260px',
              padding: '16px',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 10px 30px rgba(0, 66, 37, 0.08)',
              border: '1px solid var(--border-color)',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block', paddingLeft: '8px' }}>
                Course Categories
              </span>
              
              <button onClick={() => handleCategoryClick('Web Development')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition-smooth)'
              }} className="dropdown-item-hover">
                <Globe size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>Web Development</span>
              </button>

              <button onClick={() => handleCategoryClick('Data Science')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition-smooth)'
              }} className="dropdown-item-hover">
                <Database size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>Data Science</span>
              </button>

              <button onClick={() => handleCategoryClick('Artificial Intelligence')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition-smooth)'
              }} className="dropdown-item-hover">
                <Terminal size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>Artificial Intelligence</span>
              </button>

              <button onClick={() => handleCategoryClick('Cybersecurity')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition-smooth)'
              }} className="dropdown-item-hover">
                <Shield size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>Cybersecurity</span>
              </button>
            </div>
          )}
        </div>

        <Link to="/courses" style={{ fontSize: '0.95rem', fontWeight: '500' }} className="nav-link">
          Courses
        </Link>

        <Link to="/about" style={{ fontSize: '0.95rem', fontWeight: '500' }} className="nav-link">
          About Us
        </Link>

        <Link to="/contact" style={{ fontSize: '0.95rem', fontWeight: '500' }} className="nav-link">
          Contact Us
        </Link>

        {user ? (
          /* Profile Action dropdown */
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <button style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-glow)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'var(--transition-smooth)' }} />
            </button>

            {/* Profile Hover Dropdown Card */}
            {showProfile && (
              <div className="glass-panel animate-slide-up" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '220px',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: '0 10px 30px rgba(0, 66, 37, 0.08)',
                border: '1px solid var(--border-color)',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 110
              }}>
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', color: 'var(--text-primary)' }}>{user.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    color: 'var(--primary)',
                    background: 'rgba(0, 66, 37, 0.06)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginTop: '4px',
                    textTransform: 'uppercase'
                  }}>{user.role}</span>
                </div>

                <Link to="/dashboard" style={{
                  display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '8px', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '500', transition: 'var(--transition-smooth)'
                }} className="dropdown-item-hover" onClick={() => setShowProfile(false)}>
                  <LayoutDashboard size={14} color="var(--text-muted)" />
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" style={{
                    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '8px', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '500', transition: 'var(--transition-smooth)'
                  }} className="dropdown-item-hover" onClick={() => setShowProfile(false)}>
                    <LayoutDashboard size={14} color="var(--text-muted)" />
                    Admin Panel
                  </Link>
                )}

                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px', background: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '600', transition: 'var(--transition-smooth)'
                }} className="dropdown-item-hover-danger">
                  <LogOut size={14} color="var(--danger)" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/auth?mode=login" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              Log In
            </Link>
            <Link to="/auth?mode=register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
