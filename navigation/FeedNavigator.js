import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LeapDetailsScreen from '../screens/LeapDetailsScreen';
import LeapsOfUser from '../screens/LeapsOfUser';
import LeapsScreen from '../screens/LeapsScreen';

const Stack = createStackNavigator();

export default FeedNavigator = () => (
  <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Leaps" component={LeapsScreen} />
    <Stack.Screen name="Leap" component={LeapDetailsScreen} />
    <Stack.Screen name="Leaps of User" component={LeapsOfUser} />
  </Stack.Navigator>
);
