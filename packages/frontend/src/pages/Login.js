import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, linkStyles, formStyles, contentContainerStyles, titleStyles, inputStyles, cardStyles, subheadingStyles, logoStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Add this hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    InitDefaultCredibleCupidClient(null);
    let apiInstance = new CredibleCupid.AuthApi();
    let loginRequest = new CredibleCupid.LoginRequest(email, password);

    apiInstance.authLogin(loginRequest, (error, data, response) => {
      if (error) {
        console.error(response);
        console.error(response.body.message);
        console.error(response.body.statusCode);
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
    </div>
  );
}

export default Login;