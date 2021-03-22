import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AccountScreen from '../screens/AccountScreen';
import FavoriteLeaps from '../screens/FavoriteLeaps';
import MessagesScreen from '../screens/MessagesScreen';
import MyLeapsScreen from '../screens/MyLeapsScreen';

const Stack = createStackNavigator();

export default AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="My Leaps" component={MyLeapsScreen} />
    <Stack.Screen name="Favourite Leaps" component={FavoriteLeaps} />
  </Stack.Navigator>
);
