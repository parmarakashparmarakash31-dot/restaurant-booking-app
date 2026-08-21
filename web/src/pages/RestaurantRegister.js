import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRestaurant } from '../services/api';

function RestaurantRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    totalSeats: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await registerRestaurant({
        ...formData,
        totalSeats: parseInt(formData.totalSeats)
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🏪 Register Your Restaurant</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">✅ Restaurant registered successfully!</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">Restaurant Name *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="10-digit phone number"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address *</label>
          <input
            type="text"
            name="address"
            className="form-input"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            type="text"
            name="city"
            className="form-input"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Total Seats *</label>
          <input
            type="number"
            name="totalSeats"
            className="form-input"
            value={formData.totalSeats}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? '⏳ Registering...' : '✅ Register Restaurant'}
        </button>
      </form>
    </div>
  );
}

export default RestaurantRegister;
