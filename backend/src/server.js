const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= DATABASE CONNECTION =============
connectDB();

// ============= ROUTES =============
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/seats', require('./routes/seats'));

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date(),
    status: 'OK'
  });
});

// ============= ERROR HANDLER =============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message,
    status: 'ERROR'
  });
});

// ============= START SERVER =============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════╗
    ║  🍽️  Restaurant Booking Server    ║
    ║  Running on port ${PORT}                ║
    ║  Environment: ${process.env.NODE_ENV}         ║
    ╚════════════════════════════════════╝
  `);
});
