import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native'; // Added Text import
import { vehicleOperations } from '../db/database';
import { Button } from '../components/Button';
import VehicleCard from '../components/VehicleCard';
import { theme } from '../theme';

export default function VehicleListScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [user, setUser] = useState({ isAdmin: false });
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    loadVehicles();
    const currentUser = global.currentUser;
    setUser(currentUser);
  }, []);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const availableVehicles = await vehicleOperations.getAvailableVehicles();
      setVehicles(availableVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No vehicles available at the moment</Text>
      <Button
        title="Refresh"
        onPress={loadVehicles}
        variant="primary"
        style={styles.refreshButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {user.isAdmin && (
          <Button
            title="Admin Dashboard"
            onPress={() => navigation.navigate('AdminDashboard')}
            variant="primary"
            style={styles.button}
          />
        )}
        <Button
          title="View Rental History"
          onPress={() => navigation.navigate('MyRentals')}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <FlatList
        data={vehicles}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          !vehicles.length && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={loadVehicles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  refreshButton: {
    minWidth: 120,
  },
});

