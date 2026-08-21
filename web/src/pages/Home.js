import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRestaurants } from '../services/api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await getAllRestaurants();
      setRestaurants(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading restaurants...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button onClick={fetchRestaurants} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>🍽️ Find Your Perfect Restaurant</h1>
        <p style={{ color: '#666', marginTop: '1rem' }}>Browse and book your favorite restaurants</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/register-restaurant" className="btn btn-primary">Register Your Restaurant</Link>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="empty-state">
          <h2>No restaurants available yet</h2>
          <p>Check back soon!</p>
        </div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <div className="card-header">🏪</div>
              <div className="card-body">
                <div className="card-title">{restaurant.name}</div>
                <div className="card-info">📍 {restaurant.address}</div>
                <div className="card-info">🏙️ {restaurant.city}</div>
                <div className="card-info">📞 {restaurant.phone}</div>
                <div className="card-info">🪑 {restaurant.totalSeats} seats available</div>
                {restaurant.rating > 0 && (
                  <div className="card-rating">⭐ {restaurant.rating}/5</div>
                )}
                <Link
                  to={`/restaurant/${restaurant._id}`}
                  className="card-button"
                  style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
