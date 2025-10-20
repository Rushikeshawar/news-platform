// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Shield } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/pages/RegisterPage.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes

  const { requestRegistrationOTP, verifyOTPAndRegister, resendOTP } = useAuth();
  const navigate = useNavigate();

  // OTP Timer countdown
  React.useEffect(() => {
    if (step === 2 && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, otpTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await requestRegistrationOTP(formData);
      
      if (result.success) {
        setStep(2);
        setOtpTimer(600);
      } else {
        setErrors({ general: result.error || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await verifyOTPAndRegister(formData.email, otp);
      
      if (result.success) {
        navigate('/');
      } else {
        setErrors({ otp: result.error || 'Invalid OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await resendOTP(formData.email);
      if (result.success) {
        setOtpTimer(600);
        setErrors({});
      }
    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          <div className="register-header">
            <h1 className="register-title">
              <UserPlus size={24} />
              {step === 1 ? 'Join Lines' : 'Verify Your Email'}
            </h1>
            <p className="register-subtitle">
              {step === 1 
                ? 'Create your account to get started' 
                : `Enter the OTP sent to ${formData.email}`}
            </p>
          </div>

          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="register-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="register-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="otp-form">
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <div className="input-wrapper">
                  <Shield className="input-icon" size={18} />
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`form-input otp-input ${errors.otp ? 'error' : ''}`}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                </div>
                {errors.otp && <span className="error-message">{errors.otp}</span>}
              </div>

              <div className="otp-timer">
                <p>OTP expires in: <strong>{formatTime(otpTimer)}</strong></p>
              </div>

              <button type="submit" className="register-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Verify & Register
                  </>
                )}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleResendOTP}
                  disabled={isLoading || otpTimer > 540}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setStep(1)}
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;