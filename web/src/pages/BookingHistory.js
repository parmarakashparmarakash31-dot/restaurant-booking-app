import React, { useState, useEffect } from 'react';
import { getCustomerBookings, cancelBooking } from '../services/api';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user._id || 'guest';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getCustomerBookings(customerId);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading your bookings...</div>;
  }

  return (
    <div className="container">
      <h1>📋 My Bookings</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No bookings yet</h2>
          <p>Start by booking a restaurant!</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {bookings.map(booking => (
            <div key={booking._id} style={{
              background: 'white',
              padding: '1.5rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Restaurant:</strong> {booking.restaurantId?.name || 'N/A'}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(booking.visitDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {booking.visitTime}
                </div>
                <div>
                  <strong>Persons:</strong> {booking.numberOfPersons}
                </div>
                <div>
                  <strong>Status:</strong> <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: booking.status === 'confirmed' ? '#d4edda' : booking.status === 'cancelled' ? '#f8d7da' : '#cfe2ff',
                    color: booking.status === 'confirmed' ? '#155724' : booking.status === 'cancelled' ? '#721c24' : '#084298'
                  }}>{booking.status}</span>
                </div>
              </div>
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
