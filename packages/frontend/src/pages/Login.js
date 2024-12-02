import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, linkStyles, formStyles, contentContainerStyles, titleStyles, inputStyles, cardStyles, subheadingStyles, logoStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    InitDefaultCredibleCupidClient(null);
    let apiInstance = new CredibleCupid.AuthApi();
    let loginRequest = new CredibleCupid.LoginRequest(email, password);

    apiInstance.authLogin(loginRequest, (error, data, response) => {
      if (error) {
        let errorMessage;
        if (response?.body?.message) {
            errorMessage = response.body.message;
        } else if (response?.body?.error) {
            errorMessage = response.body.error;
        } else {
            errorMessage = "Login failed. Please try again.";
        }
        setAlertMessage(errorMessage);
        setShowAlert(true);
        setIsLoading(false);
      } else {
        console.log("Successfully logged in!")
        InitDefaultCredibleCupidClient(data.jwt);
        sessionStorage.setItem("jwtToken", data.jwt);

        apiInstance.authRefresh((error, data, response) => {
          if (error) {
            console.error(response);
            console.error(response.body.message);
            console.error(response.body.statusCode);
          } else {
            console.log("Refreshed auth token!");
            navigate('/browse'); // Navigate to profile page
          }
        });
      }
      setIsLoading(false);
    });
  };

  const Alert = ({ message, onClose }) => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }}>
        <div style={{
            backgroundColor: 'white',
            padding: spacing.xl,
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '70%'
        }}>
            <div style={{
                marginBottom: spacing.lg,
                fontSize: '16px',
                lineHeight: '1.5',
                color: colors.gray.text,
                whiteSpace: 'pre-line'
            }}>
                {message}
            </div>
            <button
                onClick={onClose}
                style={{
                    ...buttonStyles.base,
                    width: '100%',
                    marginTop: spacing.md
                }}
            >
                OK
            </button>
        </div>
    </div>
);

  return (
    <div style={cardStyles.container}>
      {/* Logo Section */}
      <div style={logoStyles.container}>
        <img
          src={logo}
          alt="Heart icon"
          style={logoStyles.image}
        />
      </div>

      {/* Content Container */}
      <div style={contentContainerStyles.container}>
        {/* Header Section */}
        <div style={contentContainerStyles.header}>
          <h1 style={titleStyles}> Welcome Back </h1>
          <p style={subheadingStyles}>
            Sign in to continue to Credible Cupid
          </p>
        </div>

        {/* Form Section */}
        <form
          style={formStyles}
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>Email</label>
            <input
              style={inputStyles.input}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <label style={inputStyles.label}>
              Password
            </label>
            <input
              style={inputStyles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {/* Login Link */}
        <p style={linkStyles.nonLink}>
          New user?{' '}
          <Link to="/register" style={linkStyles.link}>
            Register here
          </Link>
        </p>
      </div>
      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default Login;