import React from 'react';
import { Sparkles, Shield, BookOpen, Users, Compass, Cpu } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Cpu size={24} color="var(--primary)" />,
      title: "Context-Aware Tutor",
      desc: "Our Study Buddy reads your exact lesson content to explain code and summarize takeaways in real-time."
    },
    {
      icon: <BookOpen size={24} color="var(--secondary)" />,
      title: "Structured Syllabuses",
      desc: "Every course is mapped step-by-step with lessons, videos, and reading materials curated by experts."
    },
    {
      icon: <Shield size={24} color="var(--success)" />,
      title: "Secure Progress",
      desc: "Track completed courses and lesson timelines with secure MERN database persistence."
    }
  ];

  return (
    <div style={{ padding: '0 40px 60px 40px', maxWidth: '1000px', margin: '0 auto' }} className="animate-slide-up">
      {/* Intro Hero */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <span style={{
          background: 'rgba(37, 99, 235, 0.08)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} color="#d97706" />
          Our Mission
        </span>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>
          Bridging Classroom Syllabuses with{' '}
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Artificial Intelligence
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '700px' }}>
          NextLearn was founded with a single vision: to ensure no student ever gets stuck on a homework assignment or coding problem again. By integrating Gemini API context directly into coursework, we provide a personalized 24/7 tutor for every student.
        </p>
      </section>

      {/* Stats Board */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        margin: '40px 0 60px 0',
        padding: '30px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontFamily: 'var(--font-display)', fontWeight: '800' }}>15,000+</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>Active Learners</p>
        </div>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--secondary)', fontFamily: 'var(--font-display)', fontWeight: '800' }}>30+</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>Expert Programs</p>
        </div>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--success)', fontFamily: 'var(--font-display)', fontWeight: '800' }}>98.4%</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>Completion Satisfaction</p>
        </div>
      </section>

      {/* Core Values */}
      <section>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: '32px' }}>
          What Powers NextLearn
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {values.map((v, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.02)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>{v.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
