import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking, getAvailableSeats } from '../services/api';

function Booking() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    visitDate: '',
    visitTime: '6:00 PM',
    numberOfPersons: 1,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user._id || 'guest';

  useEffect(() => {
    fetchSeats();
  }, [restaurantId]);

  const fetchSeats = async () => {
    try {
      const response = await getAvailableSeats(restaurantId);
      setSeats(response.data);
    } catch (err) {
      setError('Failed to load available seats');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    try {
      await createBooking({
        restaurantId,
        customerId,
        ...formData,
        selectedSeats
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError('Failed to create booking: ' + err.response?.data?.error || err.message);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading seats...</div>;
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>📅 Book Your Table</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✅ Booking created successfully!</div>}

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              name="customerName"
              className="form-input"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="customerPhone"
              className="form-input"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="10-digit phone number"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="customerEmail"
              className="form-input"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visit Date *</label>
            <input
              type="date"
              name="visitDate"
              className="form-input"
              value={formData.visitDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visit Time *</label>
            <select
              name="visitTime"
              className="form-select"
              value={formData.visitTime}
              onChange={handleInputChange}
              required
            >
              <option>10:00 AM</option>
              <option>10:30 AM</option>
              <option>11:00 AM</option>
              <option>11:30 AM</option>
              <option>12:00 PM</option>
              <option>12:30 PM</option>
              <option>1:00 PM</option>
              <option>1:30 PM</option>
              <option>2:00 PM</option>
              <option>6:00 PM</option>
              <option>6:30 PM</option>
              <option>7:00 PM</option>
              <option>7:30 PM</option>
              <option>8:00 PM</option>
              <option>8:30 PM</option>
              <option>9:00 PM</option>
              <option>9:30 PM</option>
              <option>10:00 PM</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Persons *</label>
            <select
              name="numberOfPersons"
              className="form-select"
              value={formData.numberOfPersons}
              onChange={handleInputChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests</label>
            <textarea
              name="specialRequests"
              className="form-textarea"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any special requests? (optional)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Seats ({selectedSeats.length} selected)</label>
            <div className="seat-grid">
              {seats.map(seat => (
                <div
                  key={seat._id}
                  className={`seat ${seat.isAvailable ? 'available' : 'unavailable'} ${selectedSeats.includes(seat._id) ? 'selected' : ''}`}
                  onClick={() => seat.isAvailable && handleSeatSelect(seat._id)}
                  title={`Seat ${seat.seatNumber}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="form-button">✅ Confirm Booking</button>
          <button
            type="button"
            className="btn"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#ddd', cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          >
            ← Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
