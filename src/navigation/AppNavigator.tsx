import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/AuthScreen";
import OTPScreen from "../screens/OTPScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PermissionScreen from "../screens/PermissionScreen";
import WorkerDetailsScreen from "../screens/WorkerDetailsScreen";
import DashboardScreen from "../screens/DashboardScreen";
import EmergencyContactScreen from "../screens/EmergencyContactScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="OTP"
          component={OTPScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="Permissions"
          component={PermissionScreen}
        />

        <Stack.Screen
          name="WorkerDetails"
          component={WorkerDetailsScreen}
        />
                <Stack.Screen
  name="EmergencyContact"
  component={EmergencyContactScreen}
/>

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}