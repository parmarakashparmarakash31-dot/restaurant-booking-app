import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById, getAvailableSeats } from '../services/api';

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const restaurantResponse = await getRestaurantById(id);
      setRestaurant(restaurantResponse.data);

      const seatsResponse = await getAvailableSeats(id);
      setSeats(seatsResponse.data);

      setError(null);
    } catch (err) {
      setError('Failed to load restaurant details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login or show login modal
      alert('Please login first to make a booking');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return <div className="loading">🔄 Loading restaurant details...</div>;
  }

  if (error || !restaurant) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Restaurant not found'}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-title">🏪 {restaurant.name}</div>
        </div>

        <div className="detail-info">
          <div className="info-item">
            <div className="info-label">📍 Address</div>
            <div className="info-value">{restaurant.address}</div>
          </div>
          <div className="info-item">
            <div className="info-label">🏙️ City</div>
            <div className="info-value">{restaurant.city}</div>
          </div>
          <div className="info-item">
            <div className="info-label">📞 Phone</div>
            <div className="info-value">{restaurant.phone}</div>
          </div>
          <div className="info-item">
            <div className="info-label">🪑 Total Seats</div>
            <div className="info-value">{restaurant.totalSeats}</div>
          </div>
          <div className="info-item">
            <div className="info-label">✅ Available Seats</div>
            <div className="info-value">{seats.filter(s => s.isAvailable).length}</div>
          </div>
          {restaurant.rating > 0 && (
            <div className="info-item">
              <div className="info-label">⭐ Rating</div>
              <div className="info-value">{restaurant.rating}/5</div>
            </div>
          )}
        </div>

        {restaurant.menuCard && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3>📋 Menu Card</h3>
            <img src={restaurant.menuCard} alt="Menu" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            📅 Book a Table
          </button>
          <button onClick={() => navigate('/')} className="btn" style={{ width: '100%', padding: '1rem', marginTop: '1rem', background: '#ddd', cursor: 'pointer' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
