import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import colors from '../config/colors';
import LeapAddScreen from '../screens/LeapAddScreen';
import AccountNavigator from './AccountNavigator';
import FeedNavigator from './FeedNavigator';
import NewListingButton from './NewListingButton';
import routes from './routes';

const Tab = createBottomTabNavigator();

export default AppNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: colors.secondary,
    }}
  >
    <Tab.Screen
      name="Leaps"
      component={FeedNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="format-list-text"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="New Leap"
      component={LeapAddScreen}
      options={({ navigation }) => ({
        tabBarButton: () => (
          <NewListingButton
            onPress={() => navigation.navigate(routes.LEAP_EDIT)}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="plus-circle"
            color={color}
            size={size}
          />
        ),
      })}
    />
    <Tab.Screen
      name="Account"
      component={AccountNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);
