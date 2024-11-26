import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import CardStack from './components/CardStack';
import Register from './pages/Register';
import AiError from './pages/AiError';
import SuccessPage from './pages/SuccessPage';
import Referrals from './pages/Referrals';
import NavBar from './components/NavBar';
import * as CredibleCupidApi from './credible_cupid/src/index';
import InitDefaultCredibleCupidClient from './client/Client';

function App() {
  const [userGuid, setUserGuid] = useState(null)
  const [userGender, setUserGender] = useState(null);

  const defaultClient = CredibleCupidApi.ApiClient.instance;
  const bearer = defaultClient.authentications['bearer'];
  const jwtToken = sessionStorage.getItem("jwtToken");
  InitDefaultCredibleCupidClient(jwtToken);
  bearer.accessToken = jwtToken;

  // Determine if NavBar should be shown (exclude login, register, etc.)
  const shouldShowNavBar = !['/login', '/register', '/aierror', '/success'].includes(window.location.pathname);

  // Fetch user gender when component mounts
  useEffect(() => {
    const fetchUserGender = async () => {
      try {
        // get user guid
        let authApi = new CredibleCupidApi.AuthApi();
        authApi.authRefresh((error, data, response) => {
          if (error) {
            console.error(response);
          } else {
            setUserGuid(data.user_guid);
            sessionStorage.setItem("jwtToken", data.jwt);
          }
        });

      // use user guid to get user's gender
      const token = sessionStorage.getItem("jwtToken");
      if (token) {
        let userApi = new CredibleCupidApi.UserApi();
        userApi.queryUser(userGuid, (error, data) => {
          if (!error) {
            setUserGender(data.gender);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserGender();
}, []);

return (
  <div style={styles.pageContainer}>
    <div style={styles.contentWrapper}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userprofile/:guid" element={<UserProfile />} />
        <Route path="/browse" element={<CardStack />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aierror" element={<AiError />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>
      {shouldShowNavBar && <NavBar userGender={userGender} />}
    </div>
  </div>
);
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  }
};

export default App;