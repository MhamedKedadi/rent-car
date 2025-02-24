import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateRentalCost } from '../utils/calculations';
import { rentalOperations, vehicleOperations } from '../db/database';
import { theme } from '../theme';
import { Feather } from '@expo/vector-icons';

export default function VehicleDetailScreen({ route, navigation }) {
  const { vehicle } = route.params;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleBooking = async () => {
    try {
      const totalCost = calculateRentalCost(vehicle, startDate, endDate);
      const rental = {
        userId: global.currentUser.id, // Assuming you store logged-in user
        vehicleId: vehicle.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost,
        status: 'pending'
      };

      await rentalOperations.createRental(rental);
      await vehicleOperations.updateVehicleAvailability(vehicle.id, false);
      navigation.navigate('RentalConfirmation', { rental, vehicle });
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imagePlaceholder}>
          <Feather name="car" size={48} color={theme.colors.text.secondary} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.brand}>{vehicle.brand}</Text>
          <Text style={styles.model}>{vehicle.model} • {vehicle.year}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Daily Rate</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${vehicle.dailyRate}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Feather name="calendar" size={20} color={theme.colors.primary} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>{startDate.toLocaleDateString()}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Feather name="calendar" size={20} color={theme.colors.primary} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>{endDate.toLocaleDateString()}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
              minimumDate={new Date()}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
              minimumDate={startDate}
            />
          )}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalAmount}>
              ${calculateRentalCost(vehicle, startDate, endDate)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 250,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: -theme.borderRadius.lg,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  titleContainer: {
    marginBottom: theme.spacing.lg,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  model: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  priceCard: {
    backgroundColor: '#F3F4F6',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  dateSection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  dateValue: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  totalContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#F3F4F6',
    borderRadius: theme.borderRadius.md,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  bookButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
