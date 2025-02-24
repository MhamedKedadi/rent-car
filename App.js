import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { initDatabase } from "./db/database";
import VehicleListScreen from "./screens/VehicleListScreen";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
import RentalConfirmationScreen from "./screens/RentalConfirmationScreen";
import AuthScreen from "./screens/AuthScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import MyRentalsScreen from "./screens/MyRentalScreen";
import AddEditVehicleScreen from "./screens/AddEditVehicleSreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setIsLoading(false);
      } catch (error) {
        console.error("Database initialization error:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Initializing app...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-lg mb-2">Something went wrong</Text>
        <Text className="text-gray-600 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen
          name="VehicleList"
          component={VehicleListScreen}
          options={{
            title: "Available Vehicles",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="VehicleDetail"
          component={VehicleDetailScreen}
          options={({ route }) => ({
            title:
              route.params.vehicle.brand + " " + route.params.vehicle.model,
          })}
        />
        <Stack.Screen
          name="RentalConfirmation"
          component={RentalConfirmationScreen}
          options={{
            title: "Rental Confirmation",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: "Admin Dashboard",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="MyRentals"
          component={MyRentalsScreen}
          options={{
            title: "My Rentals",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="AddEditVehicle"
          component={AddEditVehicleScreen}
          options={({ route }) => ({
            title: route.params?.vehicle ? "Edit Vehicle" : "Add Vehicle",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
