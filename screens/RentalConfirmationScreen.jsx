import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function RentalConfirmationScreen({ route, navigation }) {
  const { rental, vehicle } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with Icon */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>🎉 Booking Confirmed!</Text>
        </View>

        {/* Vehicle Image */}
        <Image
          source={{ uri: vehicle.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.vehicleImage}
          resizeMode="cover"
        />

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>🚗 Vehicle:</Text>
            <Text style={styles.value}>{`${vehicle.brand} ${vehicle.model}`}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>📅 Start Date:</Text>
            <Text style={styles.value}>
              {new Date(rental.startDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>📅 End Date:</Text>
            <Text style={styles.value}>
              {new Date(rental.endDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>💵 Total Cost:</Text>
            <Text style={[styles.value, styles.totalCost]}>${rental.totalCost}</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MyRentals')}
        >
          <Text style={styles.buttonText}>View My Rentals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalCost: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
