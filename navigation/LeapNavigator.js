import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LeapScreen from '../screens/LeapScreen';
import LeapsOfUser from '../screens/LeapsOfUser';

const Stack = createStackNavigator();

export default AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Leap" component={LeapScreen} />
    <Stack.Screen name="Leaps of user" component={LeapsOfUser} />
  </Stack.Navigator>
);
