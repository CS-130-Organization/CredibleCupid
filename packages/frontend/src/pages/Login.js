import React, { useState } from 'react';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import { colors, spacing } from '../styles/theme';
import { buttonStyles, inputStyles, cardStyles } from '../styles/commonStyles';
import logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    InitDefaultCredibleCupidClient(null);
    let apiInstance = new CredibleCupid.AuthApi();
    let loginRequest = new CredibleCupid.LoginRequest(username, password);

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
          }
        });
      }
      setIsLoading(false);
    });
  };

  
  return (
    <div style={cardStyles.container}>
      {/* Logo Section */}
      <div style={{
        width: '120px', // Smaller logo
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60px' // Push down from top
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
        padding: '0 spacing.xl',
        maxWidth: '350px', // Constrain width of form
        marginTop: spacing.xl
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
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: colors.gray.text,
            opacity: 0.7,
            margin: 0
          }}>
            Sign in to continue to Credible Cupid
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
          {/* Username Input */}
          <div style={inputStyles.container}>
            <label style={inputStyles.label}>
              Username
            </label>
            <input
              style={inputStyles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
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
        <p style={{
          textAlign: 'center',
          marginTop: spacing.lg,
          fontSize: '14px',
          color: colors.gray.text
        }}>
          New user?{' '}
          <Link to="/register" style={{
            color: colors.primary,
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;