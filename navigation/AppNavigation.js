import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../Interface/Welcome';
import Login from '../Interface/Login';
import Register from '../Interface/Register';
import TruckRequest from '../Interface/TruckRequest';
import Success from '../Interface/Success';
import Dashboard from '../Interface/Dashboard';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="TruckRequest" component={TruckRequest} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}