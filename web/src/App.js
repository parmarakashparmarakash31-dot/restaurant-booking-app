import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import RestaurantRegister from './pages/RestaurantRegister';
import RestaurantDashboard from './pages/RestaurantDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'restaurant'

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType || 'customer');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType('customer');
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-logo">🍽️ Restaurant Booking</div>
            <div className="navbar-menu">
              {user ? (
                <>
                  <span className="user-info">{user.name || user.email}</span>
                  <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </>
              ) : (
                <>
                  <a href="/" className="nav-link">Home</a>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/booking/:restaurantId" element={user ? <Booking user={user} /> : <Navigate to="/" />} />
          <Route path="/history" element={user ? <BookingHistory user={user} /> : <Navigate to="/" />} />
          <Route path="/register-restaurant" element={<RestaurantRegister />} />
          <Route path="/dashboard" element={user && userType === 'restaurant' ? <RestaurantDashboard user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
