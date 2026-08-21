# Quick Start Guide - 3 Minutes Setup ⚡

## Prerequisites
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB running (local or cloud)
- ✅ Git installed

## Step 1: Clone & Navigate
```bash
git clone https://github.com/parmarakashparmarakash31-dot/restaurant-booking-app.git
cd restaurant-booking-app
```

## Step 2: Setup Backend
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/restaurant-booking" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start backend
npm run dev
```
You should see: ✅ Server running on port 5000

## Step 3: Setup Web App (In new terminal)
```bash
cd web
npm install
npm start
```
Browser will open at: http://localhost:3000

## Step 4: Setup Mobile App (In new terminal)
```bash
# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

cd mobile
npm install

# IMPORTANT: Edit App.js and change API_BASE_URL to your computer IP
# Example: 192.168.1.100:5000

npm start
```
Scan QR code with Expo Go app

## Test the App

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "message": "Server is running",
  "status": "OK"
}
```

### Register a Restaurant
```bash
curl -X POST http://localhost:5000/api/restaurants/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Restaurant",
    "email": "restaurant@example.com",
    "password": "password123",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "New York",
    "totalSeats": 50
  }'
```

## Folder Structure

```
restaurant-booking-app/
├── backend/          # Express.js API server
├── web/              # React web application
├── mobile/           # React Native mobile app
├── README.md         # Project documentation
├── SETUP_GUIDE.md    # Detailed setup guide
└── QUICKSTART.md     # This file
```

## Common Issues

### MongoDB Connection Error
```
❌ MongoDB Connection Failed: connect ECONNREFUSED
```
**Solution:** Start MongoDB service
- Windows: `mongod`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Port 5000 Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in backend/.env
```
PORT=5001
```

### Mobile App Can't Connect to Backend
```
❌ Failed to connect to backend
```
**Solution:** Update API_BASE_URL in mobile/App.js with your computer's IP
```javascript
const API_BASE_URL = 'http://192.168.1.100:5000/api'; // Your IP here
```

### React App Shows Blank Page
**Solution:** 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check backend is running
3. Open browser console (F12) for errors

## Next Steps

1. ✅ Register a restaurant through web app
2. ✅ Create seats for the restaurant
3. ✅ Book a table on mobile or web
4. ✅ View bookings and manage them
5. ✅ Add payment integration
6. ✅ Deploy to production

## API Endpoints Reference

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants/register` - Register new restaurant
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/:id` - Get customer bookings
- `GET /api/bookings/restaurant/:id` - Get restaurant bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Seats
- `GET /api/seats/:restaurantId` - Get all seats
- `GET /api/seats/:restaurantId/available` - Get available seats
- `POST /api/seats/:restaurantId/create` - Create seats

## Support

For detailed instructions, see:
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Complete setup guide
- `mobile/README.md` - Mobile app specific setup

## Happy Coding! 🚀
