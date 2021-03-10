import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import ListingsScreen from '../screens/ListingsScreen';

const Stack = createStackNavigator();

export default FeedNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Petitions" component={ListingsScreen} />
    <Stack.Screen name="Petition" component={ListingDetailsScreen} />
  </Stack.Navigator>
);
