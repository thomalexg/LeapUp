import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import AuthContext from './auth/context';
import UsernameContext from './auth/usernameContext';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
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
  // console.log('user', user);

  useEffect(() => {
    (async () => {
      setUser(await cache.get('user', 43200));
    })();
  }, [setUser, cache]);
  // const getUser = async () => {
  //   const response = await cache.get('user', 43200);
  //   if (response) return setUser(response);
  //   console.log(response);
  // };
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <UsernameContext.Provider value={{ username, setUsername }}>
        <NavigationContainer>
          {user ? <AppNavigator /> : <AuthNavigator setUser={setUser} />}
          {/* <AppNavigator /> */}
          {/* <AuthNavigator /> */}
        </NavigationContainer>
      </UsernameContext.Provider>
    </AuthContext.Provider>
  );
};

// export default App;
