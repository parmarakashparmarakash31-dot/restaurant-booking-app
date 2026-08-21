const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  customerId: {
    type: String,
    required: [true, 'Customer ID is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    match: [/^[0-9]{10}$/, 'Please provide valid 10-digit phone number']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    match: [/^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required']
  },
  visitTime: {
    type: String,
    required: [true, 'Visit time is required'],
    enum: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', 
           '1:00 PM', '1:30 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', 
           '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM']
  },
  numberOfPersons: {
    type: Number,
    required: [true, 'Number of persons is required'],
    min: 1,
    max: 20
  },
  selectedSeats: [Number],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
