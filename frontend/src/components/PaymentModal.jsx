import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, ShieldCheck, Lock, RefreshCw, CheckCircle, X, Globe } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'netbanking'
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentState, setPaymentState] = useState('input'); // 'input', 'processing', 'success'
  const [processingStatus, setProcessingStatus] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state on modal close
      setPaymentState('input');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setUpiId('');
      setSelectedBank('');
      setProcessingStatus('');
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Format card number as XXXX XXXX XXXX XXXX
    const matches = value.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) setCvv(value);
  };

  const handlePay = () => {
    setPaymentState('processing');
    const steps = [
      'Initiating secure transactional gateway...',
      'Verifying credit vault authentication details...',
      'Validating payment authorization tokens with local bank...',
      'Finishing ledger enrollment records...'
    ];

    let currentStep = 0;
    setProcessingStatus(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStatus(steps[currentStep]);
      } else {
        clearInterval(interval);
        setPaymentState('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #132b50 0%, #09172c 100%)',
        border: '1px solid rgba(193, 154, 107, 0.3)',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        color: '#faf9f5',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden'
      }}>
        {/* Decorative Gradient Glows */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(193, 154, 107, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {paymentState === 'input' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Secure Checkout
                </span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '4px', fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                  Complete Payment
                </h3>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#a0aec0',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#a0aec0';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Course Summary Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ maxWidth: '70%' }}>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Purchasing Syllabus</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {course.title}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Total Cost</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  ₹{course.price || 999}
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              {[
                { id: 'card', label: 'Card', icon: <CreditCard size={14} /> },
                { id: 'upi', label: 'UPI', icon: <Smartphone size={14} /> },
                { id: 'netbanking', label: 'Net Banking', icon: <Globe size={14} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 0',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#a0aec0',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Panel */}
            <div style={{ minHeight: '160px', marginBottom: '24px' }}>
              {activeTab === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                      Cardholder Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Smith"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                      Card Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          letterSpacing: '1px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                      <CreditCard size={16} color="#a0aec0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                        Expiry Date
                      </label>
                      <input 
                        type="text" 
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          textAlign: 'center'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                        CVV / Code
                      </label>
                      <input 
                        type="password" 
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="***"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          textAlign: 'center'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                      Enter UPI ID
                    </label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. alexstudent@okaxis"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a0aec0', lineHeight: '1.4' }}>
                    A checkout prompt will be sent directly to your registered UPI application. Open the app to complete authorization.
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#a0aec0', marginBottom: '6px', fontWeight: '600' }}>
                      Select Your Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#09172c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">-- Choose Bank --</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a0aec0', lineHeight: '1.4' }}>
                    You will be redirected securely to your bank portal page to authenticate login credentials.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button 
              onClick={handlePay}
              disabled={
                (activeTab === 'card' && (!cardNumber || !expiry || !cvv)) ||
                (activeTab === 'upi' && !upiId) ||
                (activeTab === 'netbanking' && !selectedBank)
              }
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShieldCheck size={18} />
              Pay ₹{course.price || 999} Now
            </button>

            {/* Footer Trust badging */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#a0aec0',
              marginTop: '16px'
            }}>
              <Lock size={12} color="var(--accent)" />
              <span>PCI-DSS Compliant 256-Bit SSL Encryption Protection</span>
            </div>
          </>
        )}

        {paymentState === 'processing' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
            textAlign: 'center',
            gap: '24px'
          }}>
            <RefreshCw 
              size={48} 
              color="var(--accent)" 
              className="animate-spin"
              style={{
                animation: 'spin 2s linear infinite'
              }}
            />
            <div>
              <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                Verifying Transaction...
              </h4>
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto', lineHeight: '1.5' }}>
                {processingStatus}
              </p>
            </div>
          </div>
        )}

        {paymentState === 'success' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
            textAlign: 'center',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgb(16, 185, 129)'
            }}>
              <CheckCircle size={48} color="rgb(16, 185, 129)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'rgb(16, 185, 129)' }}>
                Payment Successful!
              </h3>
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto', lineHeight: '1.4' }}>
                Transaction processed successfully. Re-routing to your course view room...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
