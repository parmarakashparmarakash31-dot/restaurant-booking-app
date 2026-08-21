const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required'],
    index: true
  },
  seatNumber: {
    type: Number,
    required: [true, 'Seat number is required']
  },
  tableNumber: String,
  capacity: {
    type: Number,
    default: 2,
    min: 1,
    max: 10
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  bookedDate: Date,
  bookedTime: String,
  lastBookedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

seatSchema.index({ restaurantId: 1, isAvailable: 1 });

module.exports = mongoose.model('Seat', seatSchema);
