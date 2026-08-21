const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');
const Restaurant = require('../models/Restaurant');

// ============= GET ALL SEATS FOR RESTAURANT =============
router.get('/:restaurantId', async (req, res) => {
  try {
    const seats = await Seat.find({ restaurantId: req.params.restaurantId });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= GET AVAILABLE SEATS =============
router.get('/:restaurantId/available', async (req, res) => {
  try {
    const seats = await Seat.find({ 
      restaurantId: req.params.restaurantId,
      isAvailable: true 
    });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= CREATE SEATS FOR RESTAURANT =============
router.post('/:restaurantId/create', async (req, res) => {
  try {
    const { numberOfSeats, seatsPerTable } = req.body;

    // Check restaurant exists
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Create seats
    const seats = [];
    for (let i = 1; i <= numberOfSeats; i++) {
      seats.push({
        restaurantId: req.params.restaurantId,
        seatNumber: i,
        tableNumber: `Table ${Math.ceil(i / (seatsPerTable || 2))}`,
        capacity: seatsPerTable || 2,
        isAvailable: true
      });
    }

    const createdSeats = await Seat.insertMany(seats);

    res.status(201).json({
      message: `${createdSeats.length} seats created successfully`,
      count: createdSeats.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= UPDATE SEAT =============
router.put('/:seatId', async (req, res) => {
  try {
    const { isAvailable, bookedDate, bookedTime } = req.body;

    const seat = await Seat.findByIdAndUpdate(
      req.params.seatId,
      { isAvailable, bookedDate, bookedTime, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    res.json({ message: 'Seat updated successfully', seat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
