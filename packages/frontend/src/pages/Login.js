import React, { useState } from 'react';
import * as CredibleCupid from '../credible_cupid/src/index';
import InitDefaultCredibleCupidClient from '../client/Client';
import logo from '../assets/images/logo.png';

const colors = {
  green: {
    light: '#22c55e',
    dark: '#16a34a'
  },
  red: {
    light: '#ef4444'
  },
  gray: {
    light: '#f8f9fa',
    lighter: '#f3f4f6',
    border: '#D1D5DB',
    text: '#374151'
  },
  white: '#ffffff',
  black: {
    opacity10: 'rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    white: 'rgba(255, 255, 255, 0.9)'
  }
};

const styles = {
  container: {
    width: '390px',
    height: '844px',
    position: 'relative',
    background: `linear-gradient(145deg, ${colors.gray.lighter} 0%, ${colors.white} 100%)`,
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'center',
    overflow: 'hidden', 
  },
  loginBox: {
    backgroundColor: colors.white,
    borderRadius: '0', 
    padding: '40px 20px', 
    width: '390px', 
    minHeight: '844px', 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    boxShadow: 'none', 
  },
  logoContainer: {
    width: '100%',
    height: '320px',
    backgroundColor: colors.gray.lighter,
    borderRadius: '0', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.gray.text,
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: colors.gray.text,
    opacity: 0.8,
    margin: '0',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    alignItems: 'flex-start', 
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.gray.text,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginBottom: '4px', 
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: `1px solid ${colors.gray.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    backgroundColor: colors.gray.lighter,
  },
  button: {
    backgroundColor: colors.green.light,
    color: colors.white,
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    width: '100%',
    marginTop: '12px',
    boxShadow: `0 2px 8px ${colors.black.opacity10}`,
  }
};

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
    <div style={styles.container}>
      <div style={styles.loginBox}>
      <div style={styles.logoContainer}>
  <img
    src={logo} 
    alt="Heart icon"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover', // Changed from 'contain' to 'cover'
      opacity: 0.7,
    }}
  />
</div>
        <div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue to Credible Cupid</p>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              style={{
                ...styles.input,
                ':focus': {
                  borderColor: colors.green.light,
                  backgroundColor: colors.white,
                }
              }}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              onFocus={(e) => {
                e.target.style.borderColor = colors.green.light;
                e.target.style.backgroundColor = colors.white;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.gray.border;
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={{
                ...styles.input,
                ':focus': {
                  borderColor: colors.green.light,
                  backgroundColor: colors.white,
                }
              }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              onFocus={(e) => {
                e.target.style.borderColor = colors.green.light;
                e.target.style.backgroundColor = colors.white;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.gray.border;
                e.target.style.backgroundColor = colors.gray.lighter;
              }}
            />
          </div>
          <button
            style={styles.button}
            type="submit"
            disabled={isLoading}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = colors.green.dark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.black.opacity10}`;
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.green.light;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.black.opacity10}`;
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;