# Mobile App Setup Instructions

## Prerequisites
- Node.js installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app installed on your phone (available on App Store and Play Store)

## Installation

```bash
cd mobile
npm install
```

## Important: Configure API URL

**Before running the app, you MUST change the API_BASE_URL in App.js**

1. Open `mobile/App.js`
2. Find this line:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:5000/api'; // Change this IP!
   ```
3. Replace `192.168.1.100` with your computer's IP address

### How to find your computer's IP:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (usually something like 192.168.x.x)
```

**Mac/Linux:**
```bash
ifconfig
# Look for inet address
```

## Running the App

### Start the development server:
```bash
npm start
# or
expo start
```

### Run on device:

**Option 1: Scan QR Code**
- A QR code will appear in the terminal
- Open Expo Go app on your phone
- Scan the QR code
- App will load on your phone

**Option 2: Android Emulator**
```bash
npm run android
```

**Option 3: iOS Simulator (Mac only)**
```bash
npm run ios
```

## Features

✅ Browse all restaurants
✅ View restaurant details
✅ Book restaurant seats
✅ Select date and time
✅ Choose number of persons
✅ View booking history
✅ Cancel bookings

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend server is running on port 5000
- Check that your phone and computer are on the same WiFi
- Update the API_BASE_URL with correct IP address

### "Blank white screen"
- Check terminal for error messages
- Try reloading: Press 'r' in terminal
- Clear cache: Press 'c' in terminal

### "App keeps reloading"
- Close Expo Go app and restart
- Kill terminal and run `npm start` again

## Tips

- Keep backend server running while using the app
- Both phone and computer must be on same network
- Use localhost (127.0.0.1) only if testing on the same computer
