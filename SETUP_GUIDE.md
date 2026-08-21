# Complete Step-by-Step Guide to Build Restaurant Booking App

## 📚 Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Backend Development](#backend-development)
3. [Web App Development](#web-app-development)
4. [Mobile App Development](#mobile-app-development)
5. [Database Setup](#database-setup)
6. [Running the App](#running-the-app)

---

## Installation & Setup

### Step 1: Install Required Software

You need to install these tools:

1. **Node.js & npm** (JavaScript Runtime)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git** (Version Control)
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **MongoDB** (Database)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Cloud (free): https://www.mongodb.com/cloud/atlas

4. **Visual Studio Code** (Code Editor)
   - Download from: https://code.visualstudio.com/

### Step 2: Clone the Repository

```bash
# Open terminal/command prompt
cd Desktop  # or any folder where you want to save the project

# Clone the repository
git clone https://github.com/parmarakashparmarakash31-dot/restaurant-booking-app.git

# Navigate to project folder
cd restaurant-booking-app
```

---

## Backend Development

### Step 3: Setup Backend (Node.js + Express)

```bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install

# Create .env file for configuration
# Copy content from .env.example to .env
```

### Step 4: Run Backend Server

```bash
# Start the development server
npm run dev

# You should see a message like:
# ✅ MongoDB Connected Successfully
# 🍽️  Restaurant Booking Server Running on port 5000
```

### Step 5: Test Backend

Open your browser and go to: `http://localhost:5000/api/health`

You should see:
```json
{
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "OK"
}
```

---

## Web App Development

### Step 6: Setup React Web App

```bash
# Navigate back to main folder
cd ..

# Create React app
npx create-react-app web

# Navigate to web folder
cd web

# Install additional packages
npm install axios react-router-dom
```

### Step 7: Run Web App

```bash
npm start

# App will open at http://localhost:3000
```

---

## Mobile App Development

### Step 8: Setup React Native App (Using Expo)

```bash
# Navigate back to main folder
cd ..

# Install Expo CLI globally
npm install -g expo-cli

# Create React Native app
expo init mobile
# Choose: blank template

# Navigate to mobile folder
cd mobile

# Install packages
npm install axios
```

### Step 9: Run Mobile App

```bash
# Start Expo development server
npm start

# Or
expo start

# Then:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Scan QR code with Expo Go app (download from Play Store/App Store)
```

---

## Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB from https://www.mongodb.com/try/download/community

# Start MongoDB
# On Windows:
mongod

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

### Option 2: MongoDB Cloud (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Click "Connect" and get connection string
5. Update `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-booking
   ```

---

## Running the App

**You need 3 separate terminal windows:**

### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```
You should see: `✅ Server running on port 5000`

### Terminal 2 - Web App:
```bash
cd web
npm start
```
Browser will open at: `http://localhost:3000`

### Terminal 3 - Mobile App:
```bash
cd mobile
npm start
```
Scan QR code with Expo Go app on your phone

---

## API Endpoints to Test

### Using Postman or curl

**Test Server Health:**
```bash
curl http://localhost:5000/api/health
```

**Register a Restaurant:**
```bash
curl -X POST http://localhost:5000/api/restaurants/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "email": "pizzapalace@example.com",
    "password": "password123",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "New York",
    "totalSeats": 50
  }'
```

**Get All Restaurants:**
```bash
curl http://localhost:5000/api/restaurants
```

---

## Common Issues & Solutions

### ❌ Backend won't start
- MongoDB not running → Start MongoDB service
- Port 5000 in use → Change PORT in .env
- Dependencies not installed → Run `npm install`

### ❌ Can't connect to MongoDB
- Check MONGODB_URI in .env
- Verify MongoDB is running
- Check internet connection (if using MongoDB Cloud)

### ❌ Web app shows blank page
- Check browser console (F12) for errors
- Verify backend is running
- Clear browser cache

### ❌ Mobile app can't reach backend
- Change API URL from localhost to your computer IP
- Example: `http://192.168.1.100:5000/api`
- Both phone and computer must be on same WiFi

---

## Project Structure

```
restaurant-booking-app/
├── backend/
│   ├── src/
│   │   ├── models/       (Database schemas)
│   │   ├── routes/       (API endpoints)
│   │   ├── controllers/  (Business logic)
│   │   ├── config/       (Database config)
│   │   └── server.js     (Main server file)
│   ├── package.json
│   └── .env.example
│
├── web/
│   ├── src/
│   │   ├── components/   (Reusable components)
│   │   ├── pages/        (Page components)
│   │   ├── services/     (API services)
│   │   └── App.js
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── screens/      (App screens)
│   │   ├── components/
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

## Next Steps

1. ✅ Backend running on http://localhost:5000
2. ✅ Web app running on http://localhost:3000
3. ✅ Mobile app running on Expo
4. Create restaurant registration page
5. Create customer booking interface
6. Add seat selection feature
7. Implement payment gateway
8. Deploy to production

---

## Resources

- **Node.js/Express**: https://expressjs.com/
- **React**: https://react.dev/
- **React Native**: https://reactnative.dev/
- **MongoDB**: https://www.mongodb.com/docs/
- **Postman**: https://www.postman.com/

---

## You Got This! 🚀
