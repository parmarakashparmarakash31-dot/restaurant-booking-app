import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  SafeAreaView
} from 'react-native';
import axios from 'axios';

// ⚠️ IMPORTANT: Change this to your computer's IP address
// Find your IP: Open Command Prompt/Terminal and type: ipconfig (Windows) or ifconfig (Mac/Linux)
// Look for IPv4 Address (usually 192.168.x.x)
const API_BASE_URL = 'http://192.168.1.100:5000/api'; // Change this IP!

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home'); // 'home', 'restaurants', 'booking', 'myBookings'
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('customer_' + Math.random().toString(36).substr(2, 9));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('6:00 PM');
  const [numberOfPersons, setNumberOfPersons] = useState('1');

  useEffect(() => {
    if (activeScreen === 'restaurants') {
      fetchRestaurants();
    } else if (activeScreen === 'myBookings') {
      fetchMyBookings();
    }
  }, [activeScreen]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      Alert.alert('Error', 'Failed to load restaurants. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/customer/${customerId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRestaurant = async () => {
    if (!customerName || !customerPhone || !customerEmail || !visitDate) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        restaurantId: selectedRestaurant._id,
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        visitDate,
        visitTime,
        numberOfPersons: parseInt(numberOfPersons),
        selectedSeats: []
      });

      Alert.alert('Success', 'Booking created successfully!');
      setActiveScreen('myBookings');
      resetBookingForm();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setVisitDate('');
    setVisitTime('6:00 PM');
    setNumberOfPersons('1');
    setSelectedRestaurant(null);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      Alert.alert('Success', 'Booking cancelled');
      fetchMyBookings();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  // HOME SCREEN
  if (activeScreen === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.centerContent}>
            <Text style={styles.logo}>🍽️</Text>
            <Text style={styles.title}>Restaurant Booking</Text>
            <Text style={styles.subtitle}>Book your favorite restaurant seats</Text>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => setActiveScreen('restaurants')}
            >
              <Text style={styles.homeButtonText}>🔍 Browse Restaurants</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => setActiveScreen('myBookings')}
            >
              <Text style={styles.homeButtonText}>📋 My Bookings</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // RESTAURANTS SCREEN
  if (activeScreen === 'restaurants') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setActiveScreen('home')}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>🍽️ Restaurants</Text>
            <View style={{ width: 50 }} />
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#ff6b6b" />
            </View>
          ) : restaurants.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No restaurants found</Text>
            </View>
          ) : (
            <FlatList
              data={restaurants}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.restaurantCard}
                  onPress={() => {
                    setSelectedRestaurant(item);
                    setActiveScreen('booking');
                  }}
                >
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantInfo}>📍 {item.address}</Text>
                  <Text style={styles.restaurantInfo}>🏙️ {item.city}</Text>
                  <Text style={styles.restaurantInfo}>📞 {item.phone}</Text>
                  <Text style={styles.restaurantInfo}>🪑 {item.totalSeats} seats</Text>
                  {item.rating > 0 && (
                    <Text style={styles.restaurantInfo}>⭐ {item.rating}/5</Text>
                  )}
                  <View style={styles.buttonContainer}>
                    <Text style={styles.bookButton}>Book Now →</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  // BOOKING SCREEN
  if (activeScreen === 'booking' && selectedRestaurant) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setActiveScreen('restaurants')}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>📅 Book Table</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{selectedRestaurant.name}</Text>

              <Text style={styles.label}>Your Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit phone number"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={customerEmail}
                onChangeText={setCustomerEmail}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Visit Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={visitDate}
                onChangeText={setVisitDate}
              />

              <Text style={styles.label}>Visit Time *</Text>
              <ScrollView horizontal style={styles.timeSelector}>
                {['10:00 AM', '12:00 PM', '2:00 PM', '6:00 PM', '8:00 PM', '10:00 PM'].map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeButton, visitTime === time && styles.timeButtonActive]}
                    onPress={() => setVisitTime(time)}
                  >
                    <Text style={[styles.timeButtonText, visitTime === time && styles.timeButtonTextActive]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Number of Persons *</Text>
              <ScrollView horizontal style={styles.personSelector}>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.personButton, numberOfPersons === String(num) && styles.personButtonActive]}
                    onPress={() => setNumberOfPersons(String(num))}
                  >
                    <Text style={[styles.personButtonText, numberOfPersons === String(num) && styles.personButtonTextActive]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleBookRestaurant}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setActiveScreen('restaurants')}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // MY BOOKINGS SCREEN
  if (activeScreen === 'myBookings') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setActiveScreen('home')}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>📋 My Bookings</Text>
            <View style={{ width: 50 }} />
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#ff6b6b" />
            </View>
          ) : bookings.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No bookings yet</Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={styles.bookingCard}>
                  <Text style={styles.bookingTitle}>Restaurant: {item.customerName}</Text>
                  <Text style={styles.bookingInfo}>📅 {item.visitDate?.split('T')[0]}</Text>
                  <Text style={styles.bookingInfo}>⏰ {item.visitTime}</Text>
                  <Text style={styles.bookingInfo}>👥 {item.numberOfPersons} persons</Text>
                  <Text style={[styles.bookingInfo, { color: item.status === 'confirmed' ? '#28a745' : '#ffc107' }]}>
                    Status: {item.status}
                  </Text>
                  {item.status !== 'cancelled' && item.status !== 'completed' && (
                    <TouchableOpacity
                      style={styles.cancelBookingButton}
                      onPress={() => handleCancelBooking(item._id)}
                    >
                      <Text style={styles.cancelBookingText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  homeButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    fontWeight: '600',
    textAlign: 'center',
    overflow: 'hidden',
  },
  formContainer: {
    padding: 15,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  timeSelector: {
    marginBottom: 15,
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  timeButtonActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  timeButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  personSelector: {
    marginBottom: 15,
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  personButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  personButtonActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  personButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  personButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bookingInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cancelBookingButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelBookingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
