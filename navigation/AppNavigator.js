import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AccountScreen from '../screens/AccountScreen';
import LeapAddScreen from '../screens/LeapAddScreen';
import FeedNavigator from './FeedNavigator';

const Tab = createBottomTabNavigator();

export default AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Leaps" component={FeedNavigator} />
    <Tab.Screen name="New Leap" component={LeapAddScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);
