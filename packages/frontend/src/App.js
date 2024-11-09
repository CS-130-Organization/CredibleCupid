import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CardStack from './components/CardStack'
import Register from './pages/Register';
import NavBar from './components/NavBar'; 
import './App.css';

function App() {
  const location = useLocation();

  console.log('App rendering');
  return (
    <div className="App">
      {/* Only show NavBar if not on the login page */}
      {location.pathname !== '/login' && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/browse" element={<CardStack />} />
        <Route exact path="/register" element={<Register/>} />
        {/* ... other routes ... */}
      </Routes>
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
