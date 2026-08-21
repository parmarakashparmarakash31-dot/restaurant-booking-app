const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

// ============= CREATE BOOKING =============
router.post('/', async (req, res) => {
  try {
    const { restaurantId, customerId, customerName, customerPhone, customerEmail, visitDate, visitTime, numberOfPersons, selectedSeats, specialRequests } = req.body;

    // Validation
    if (!restaurantId || !customerId || !customerName || !customerPhone || !customerEmail || !visitDate || !visitTime || !numberOfPersons) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Create booking
    const booking = new Booking({
      restaurantId,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      visitDate,
      visitTime,
      numberOfPersons,
      selectedSeats: selectedSeats || [],
      specialRequests,
      status: 'pending'
    });

    await booking.save();

    // Update seat availability
    if (selectedSeats && selectedSeats.length > 0) {
      await Seat.updateMany(
        { _id: { $in: selectedSeats } },
        { isAvailable: false, bookedDate: visitDate, bookedTime: visitTime }
      );
    }

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= GET CUSTOMER BOOKINGS =============
router.get('/customer/:customerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.customerId })
      .populate('restaurantId', 'name address phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= GET RESTAURANT BOOKINGS =============
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const bookings = await Booking.find({ restaurantId: req.params.restaurantId })
      .sort({ visitDate: 1, visitTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= UPDATE BOOKING STATUS =============
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('restaurantId', 'name');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= CANCEL BOOKING =============
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Release seats
    if (booking.selectedSeats && booking.selectedSeats.length > 0) {
      await Seat.updateMany(
        { _id: { $in: booking.selectedSeats } },
        { isAvailable: true, bookedDate: null, bookedTime: null }
      );
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
