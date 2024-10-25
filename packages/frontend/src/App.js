import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

// ... other imports ...

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* ... other routes ... */}
        </Routes>
        <Login />
      </div>
    </Router>
  );
}

export default App;
