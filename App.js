import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import locationsApi from './api/getLocations';
import AuthContext from './auth/context';
import LocationsContext from './auth/locationContext';
import UsernameContext from './auth/usernameContext';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import cache from './utility/cache';

const Stack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [locations, setLocations] = useState([]);
  // console.log('location', locations);

  useEffect(() => {
    (async () => {
      setUser(await cache.get('user', 43200));
    })();
    (async () => {
      const locationsObject = await locationsApi.getLocations();
      const locationsArr = locationsObject.data;
      // console.log('locationsObject', locationsArr);
      setLocations(locationsArr);
    })();
  }, [setUser, cache, setLocations, locationsApi]);
  const getUser = async () => {
    const response = await cache.get('user', 43200);
    if (response) return setUser(response);
    console.log(response);
  };
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <UsernameContext.Provider value={{ username, setUsername }}>
        <LocationsContext.Provider value={{ locations }}>
          <NavigationContainer>
            <Stack.Navigator>
              {user ? (
                //  <AppNavigator />
                <Stack.Screen
                  name="AppNavigator"
                  component={AppNavigator}
                  options={{ headerShown: false }}
                />
              ) : (
                // <AuthNavigator setUser={setUser} />
                <>
                  <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </LocationsContext.Provider>
      </UsernameContext.Provider>
    </AuthContext.Provider>
  );
};

// export default App;
