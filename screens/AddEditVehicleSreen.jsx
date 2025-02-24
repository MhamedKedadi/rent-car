import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { vehicleOperations } from '../db/database';

export default function AddEditVehicleScreen({ route, navigation }) {
  const editingVehicle = route.params?.vehicle;
  const isEditing = !!editingVehicle;

  const [formData, setFormData] = useState({
    type: '',
    model: '',
    brand: '',
    year: '',
    licensePlate: '',
    dailyRate: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      setFormData({
        type: editingVehicle.type,
        model: editingVehicle.model,
        brand: editingVehicle.brand,
        year: editingVehicle.year.toString(),
        licensePlate: editingVehicle.licensePlate,
        dailyRate: editingVehicle.dailyRate.toString(),
        imageUrl: editingVehicle.imageUrl || '',
      });
    }
  }, [editingVehicle]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type?.trim()) newErrors.type = 'Vehicle type is required';
    if (!formData.model?.trim()) newErrors.model = 'Model is required';
    if (!formData.brand?.trim()) newErrors.brand = 'Brand is required';

    if (!formData.year?.trim()) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Please enter a valid year (YYYY)';
    }

    if (!formData.licensePlate?.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }

    if (!formData.dailyRate?.trim()) {
      newErrors.dailyRate = 'Daily rate is required';
    } else if (isNaN(parseFloat(formData.dailyRate)) || parseFloat(formData.dailyRate) <= 0) {
      newErrors.dailyRate = 'Please enter a valid daily rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const vehicleData = {
        type: formData.type.trim(),
        model: formData.model.trim(),
        brand: formData.brand.trim(),
        year: parseInt(formData.year),
        licensePlate: formData.licensePlate.trim(),
        dailyRate: parseFloat(formData.dailyRate),
        imageUrl: formData.imageUrl.trim() || 'https://via.placeholder.com/150',
      };

      if (isEditing) {
        // Add update vehicle functionality here when needed
        // await vehicleOperations.updateVehicle(editingVehicle.id, vehicleData);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await vehicleOperations.addVehicle(vehicleData);
        Alert.alert('Success', 'Vehicle added successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      Alert.alert('Error', 'Failed to save vehicle. Please try again.');
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
      </Text>

      {renderInput('Type', 'type', 'Enter vehicle type (e.g., SUV, Sedan)')}
      {renderInput('Brand', 'brand', 'Enter vehicle brand')}
      {renderInput('Model', 'model', 'Enter vehicle model')}
      {renderInput('Year', 'year', 'Enter vehicle year (YYYY)', 'numeric')}
      {renderInput('License Plate', 'licensePlate', 'Enter license plate')}
      {renderInput('Daily Rate ($)', 'dailyRate', 'Enter daily rate', 'decimal-pad')}
      {renderInput('Image URL', 'imageUrl', 'Enter image URL (optional)')}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF5722',
  },
  errorText: {
    color: '#FF5722',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
