const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// ============= GET ALL RESTAURANTS =============
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).select('-password');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= GET SINGLE RESTAURANT =============
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('-password');
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= REGISTER RESTAURANT =============
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city, totalSeats } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !city || !totalSeats) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      email,
      password,
      phone,
      address,
      city,
      totalSeats
    });

    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant registered successfully',
      restaurantId: restaurant._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= UPDATE RESTAURANT =============
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, address, city, totalSeats, menuCard, rating } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, city, totalSeats, menuCard, rating, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= DELETE RESTAURANT =============
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
