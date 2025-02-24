import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { vehicleOperations } from '../db/database';

export default function AdminDashboardScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadAllVehicles();
  }, []);

  const loadAllVehicles = async () => {
    try {
      const allVehicles = await vehicleOperations.getAllVehicles();
      setVehicles(allVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const renderVehicleItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {`${item.brand} ${item.model} (${item.year})`}
        </Text>
        <Text style={styles.vehicleDetails}>License Plate: {item.licensePlate}</Text>
        <Text style={styles.vehicleDetails}>Daily Rate: ${item.dailyRate}</Text>
        <Text style={[styles.vehicleDetails, item.isAvailable ? styles.available : styles.rented]}>
          Status: {item.isAvailable ? 'Available' : 'Rented'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          navigation.navigate('AddEditVehicle', { vehicle: item })
          loadAllVehicles();
        }}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('AddEditVehicle');
          loadAllVehicles();
        }}
      >
        <Text style={styles.addButtonText}>Add New Vehicle</Text>
      </TouchableOpacity>

      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleInfo: {
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  available: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  rented: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

