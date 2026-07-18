import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

// Custom inline brand SVGs for social media links to guarantee bulletproof builds
const FacebookSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer" style={{
      background: 'linear-gradient(180deg, #0b1a12 0%, #050d09 100%)',
      color: '#94a3b8',
      padding: '60px 40px 40px 40px',
      borderTop: '1px solid rgba(193, 154, 107, 0.25)',
      marginTop: 'auto',
      width: '100%',
      position: 'relative',
      fontFamily: 'inherit'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '50px'
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            color: '#ffffff', 
            margin: 0, 
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.5px'
          }}>
            NextLearn<span style={{ color: '#c19a6b' }}>.</span>
          </h2>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#a0aec0' }}>
            Premium Learning Management System, delivering elegance, structured syllabus modules, and unmatched study support across the globe.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Social Icons */}
            {[
              { id: 'fb', component: <FacebookSVG /> },
              { id: 'tw', component: <TwitterSVG /> },
              { id: 'ig', component: <InstagramSVG /> },
              { id: 'ln', component: <LinkedinSVG /> }
            ].map((social) => {
              return (
                <a 
                  key={social.id} 
                  href="#" 
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#12261c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a0aec0',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '1px solid rgba(193, 154, 107, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#c19a6b';
                    e.currentTarget.style.color = '#0b1a12';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#12261c';
                    e.currentTarget.style.color = '#a0aec0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.component}
                </a>
              );
            })}
          </div>
        </div>

        {/* Navigation Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: '800', 
            color: '#c19a6b', 
            margin: 0, 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Navigation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={{ fontSize: '0.9rem', color: '#a0aec0', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#c19a6b'} onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>Home</Link>
            <Link to="/courses" style={{ fontSize: '0.9rem', color: '#a0aec0', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#c19a6b'} onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>Courses</Link>
            <Link to="/about" style={{ fontSize: '0.9rem', color: '#a0aec0', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#c19a6b'} onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>About Us</Link>
            <Link to="/contact" style={{ fontSize: '0.9rem', color: '#a0aec0', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#c19a6b'} onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>Contact Us</Link>
          </div>
        </div>

        {/* Contact Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: '800', 
            color: '#c19a6b', 
            margin: 0, 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Contact Us
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="#c19a6b" />
              <span style={{ fontSize: '0.9rem', color: '#a0aec0' }}>support@nextlearn.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="#c19a6b" />
              <span style={{ fontSize: '0.9rem', color: '#a0aec0' }}>+1 (800) 555-0199</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={16} color="#c19a6b" style={{ marginTop: '3px' }} />
              <span style={{ fontSize: '0.9rem', color: '#a0aec0', lineHeight: '1.4' }}>
                100 Premium Way,<br />Suite A
              </span>
            </div>
          </div>
        </div>

        {/* Newsletter Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: '800', 
            color: '#c19a6b', 
            margin: 0, 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Newsletter
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: '#a0aec0' }}>
            Subscribe to catch latest premium additions and member-only promotions.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: '#12261c',
                border: '1px solid rgba(193, 154, 107, 0.25)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c19a6b'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(193, 154, 107, 0.25)'}
            />
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #004225 0%, #c19a6b 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(193, 154, 107, 0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(193, 154, 107, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(193, 154, 107, 0.15)';
              }}
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(193, 154, 107, 0.15)', width: '100%', marginBottom: '24px' }} />

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} NextLearn. All rights reserved.
        </span>

        {/* Floating Scroll up */}
        <button 
          onClick={scrollToTop}
          style={{
            position: 'absolute',
            right: 0,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'transparent',
            border: '2px solid #c19a6b',
            color: '#c19a6b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c19a6b';
            e.currentTarget.style.color = '#050d09';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#c19a6b';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
