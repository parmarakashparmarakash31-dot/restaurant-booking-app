const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[0-9]{10}$/, 'Please provide valid 10-digit phone number']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  city: {
    type: String,
    required: [true, 'Please provide city']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: 1,
    max: 1000
  },
  menuCard: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
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

restaurantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

restaurantSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
