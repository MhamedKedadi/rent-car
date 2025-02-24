import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { rentalOperations } from '../db/database';

export default function MyRentalsScreen() {
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const userRentals = await rentalOperations.getUserRentals(global.currentUser.id);
      setRentals(userRentals);
    } catch (error) {
      console.error('Error loading rentals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRentalItem = ({ item }) => (
    <View style={styles.rentalCard}>
      {/* Vehicle Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />

      {/* Vehicle Info */}
      <Text style={styles.vehicleInfo}>{`${item.brand} ${item.model}`}</Text>

      {/* Rental Dates */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>📅 Rental Dates:</Text>
        <Text style={styles.value}>
          {`${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`}
        </Text>
      </View>

      {/* Rental Status */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.status,
            item.status === 'pending' ? styles.activeStatus : styles.completedStatus,
          ]}
        >
          {item.status === 'pending' ? '✅ Active' : '❌ Completed'}
        </Text>
      </View>

      {/* Total Cost */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>💵 Total Cost:</Text>
        <Text style={styles.cost}>${item.totalCost}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={rentals}
          renderItem={renderRentalItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No rentals found</Text>
          }
          contentContainerStyle={rentals.length === 0 && styles.emptyContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  rentalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  vehicleInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeStatus: {
    color: '#4CAF50',
  },
  completedStatus: {
    color: '#F44336',
  },
  cost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
