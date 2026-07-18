import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Heart } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '0 40px 60px 40px', maxWidth: '1000px', margin: '0 auto' }} className="animate-slide-up">
      {/* Header Banner */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px 20px' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: '800', marginBottom: '12px' }}>
          Get In Touch
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxStyle: '500px', margin: '0 auto' }}>
          Have questions about pricing, API integrations, or syllabus custom builds? Send us a message!
        </p>
      </section>

      {/* Two-Column Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px', marginTop: '20px' }}>
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--primary)" /> Contact Details
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <MapPin size={18} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '600' }}>HQ Campus Office</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px', lineHeight: '1.4' }}>
                  104 Tech Boulevard, Suite 500<br />Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <Mail size={18} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '600' }}>Email Address</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  support@nextlearn.com
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <Phone size={18} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '600' }}>Telephone</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  +1 (555) 382-7235
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              Made with <Heart size={12} color="var(--danger)" fill="var(--danger)" /> by NextLearn Team
            </span>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-panel" style={{ padding: '35px 40px' }}>
          {submitted ? (
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '16px',
              padding: '40px 0'
            }} className="animate-slide-up">
              <div style={{
                background: 'rgba(5, 150, 105, 0.08)',
                color: 'var(--success)',
                padding: '16px',
                borderRadius: '50%'
              }}>
                <Send size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>Message Sent Successfully!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '300px', lineHeight: '1.5' }}>
                Thank you for reaching out. A platform representative will respond to your inquiry via email shortly.
              </p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Send Us a Message</h3>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Full Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Email Address*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Course Partnership, API Inquiries"
                  className="form-input"
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Your Message*</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write details of your message..."
                  className="form-input"
                  rows="4"
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
