import React, { useState, useEffect } from 'react';
import { getRestaurantBookings } from '../services/api';

function RestaurantDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getRestaurantBookings(user._id);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>📊 Restaurant Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>📋 Upcoming Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">No bookings yet</div>
        ) : (
          <div style={{
            overflowX: 'auto',
            marginTop: '1rem'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white'
            }}>
              <thead>
                <tr style={{ background: '#ff6b6b', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Persons</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '1rem' }}>{booking.customerName}</td>
                    <td style={{ padding: '1rem' }}>{new Date(booking.visitDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{booking.visitTime}</td>
                    <td style={{ padding: '1rem' }}>{booking.numberOfPersons}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: booking.status === 'confirmed' ? '#d4edda' : '#cfe2ff',
                        color: booking.status === 'confirmed' ? '#155724' : '#084298'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;
