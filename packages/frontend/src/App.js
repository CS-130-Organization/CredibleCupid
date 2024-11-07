import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CardStack from './components/CardStack'
import ProfileCard from './pages/ProfileCard'
import './App.css';

// ... other imports ...

function App() {
  console.log('App rendering');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profilepage" element={<Profile />} />
          <Route exact path="/profile" element={<CardStack/>} />
          {/* ... other routes ... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
