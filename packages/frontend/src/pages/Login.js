import React, { useState } from 'react';

import * as CredibleCupid from '../credible_cupid/src/index'
import InitDefaultCredibleCupidClient from '../client/Client';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    InitDefaultCredibleCupidClient(null);
    let apiInstance = new CredibleCupid.AuthApi();
    let loginRequest = new CredibleCupid.LoginRequest(username, password);

    const ret = apiInstance.authLogin(loginRequest, (error, data, response) => {
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
    });
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
