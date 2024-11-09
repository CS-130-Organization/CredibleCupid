import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, inputStyles, cardStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    bio: '',
    gender: '',
    age: '',
    height: '',
    occupation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    InitDefaultCredibleCupidClient(null);
    let apiInstance = new CredibleCupid.AuthApi();
    let registerRequest = new CredibleCupid.LoginRequest(
      formData.email,
      formData.password,
    );

    apiInstance.authSignup(registerRequest, (error, data, response) => {
      if (error) {
        console.error(response);
        console.error(response.body.message);
        console.error(response.body.statusCode);
      } else {
        console.log("Successfully registered!");
        navigate('/login');
      }
      setIsLoading(false);
    });
  };

  return (
    <div style={{
      ...cardStyles.container,
      height: '100vh',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Logo Section */}
      <div style={{
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60px',
        flexShrink: 0
      }}>
        <img
          src={logo}
          alt="Heart icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.9
          }}
        />
      </div>

      {/* Content Container */}
      <div style={{
        width: '100%',
        padding: `0 ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
        maxWidth: '350px',
        marginTop: spacing.xl,
        flexGrow: 1,
        overflow: 'auto'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing.xl
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: colors.gray.text,
            margin: `0 0 ${spacing.xs} 0`
          }}>
            Create Account
          </h1>
          <p style={{
            fontSize: '16px',
            color: colors.gray.text,
            opacity: 0.7,
            margin: 0
          }}>
            Join Credible Cupid today
          </p>
        </div>

        {/* Form Section */}
        <form 
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg
          }}
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Email</label>
            <input
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Password Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Password</label>
            <input
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Bio Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Bio</label>
            <textarea
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter,
                minHeight: '100px',
                resize: 'vertical'
              }}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              placeholder="Tell us about yourself"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Gender Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Gender</label>
            <select
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-bonary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Age</label>
            <input
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="120"
              placeholder="Enter your age"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Height Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Height (cm)</label>
            <input
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="100"
              max="250"
              placeholder="Enter your height in cm"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Occupation Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Occupation</label>
            <input
              style={{
                ...inputStyles.input,
                backgroundColor: colors.gray.lighter
              }}
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
              placeholder="Enter your occupation"
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.borderColor = colors.gray.border;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            style={{
              ...buttonStyles.base,
              marginTop: spacing.md
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: spacing.lg,
          fontSize: '14px',
          color: colors.gray.text
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: colors.primary,
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;