import React from 'react';
import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import AiError from './pages/AiError';
import SuccessPage from './pages/SuccessPage';
import CardStack from './components/CardStack';
import UserProfile from './pages/UserProfile'
import NavBar from './components/NavBar';
import MatchesPage from './pages/MatchesPage';
import { colors } from './styles/theme';
import './App.css';

const styles = {
  pageContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray.lighter,
  },
  contentWrapper: {
    width: '390px',
    height: '844px',
    position: 'relative',
    backgroundColor: colors.white,
    overflow: 'auto'
  }
};

function App() {
  const location = useLocation();
  const hideNavBarPaths = ['/login', '/register', '/error', '/success'];
  const shouldShowNavBar = !hideNavBarPaths.includes(location.pathname);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userprofile/:guid" element={<UserProfile />} />
          <Route path="/browse" element={<CardStack />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/aierror" element={<AiError />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          {/* ... other routes ... */}
        </Routes>
        {shouldShowNavBar && <NavBar />}
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}