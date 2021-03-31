import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AccountScreen from '../screens/AccountScreen';
import DeleteAccScreen from '../screens/DeleteAccScreen';
import EmailScreen from '../screens/EmailScreen';
import FavoriteLeaps from '../screens/FavoriteLeaps';
import MessagesScreen from '../screens/MessagesScreen';
import MyLeapsScreen from '../screens/MyLeapsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
const Stack = createStackNavigator();

export default AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="My Leaps" component={MyLeapsScreen} />
    <Stack.Screen name="Favourite Leaps" component={FavoriteLeaps} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Password" component={PasswordScreen} />
    <Stack.Screen name="Email" component={EmailScreen} />
    <Stack.Screen name="Delete Account" component={DeleteAccScreen} />
  </Stack.Navigator>
);
