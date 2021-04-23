import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import categoriesApi from './api/categories';
import getLeapsApi from './api/getLeaps';
import locationsApi from './api/getLocations';
import logoutApi from './api/logout';
import CategoriesContext from './auth/categoriesContext';
import AuthContext from './auth/context';
import ErrorContext from './auth/errorContext';
import FilterCategoryContext from './auth/filterCategoryContext';
import FilterLocationContext from './auth/filterLocationContext';
import LeapsContext from './auth/leapsContext';
import LeapsStateContext from './auth/leapsStateContext';
import LoadingMoreContext from './auth/loadingMoreContext';
import LoadMoreContext from './auth/loadMoreContext';
import LocationsContext from './auth/locationContext';
import NumOfLeapsContext from './auth/numOfLeapsContext';
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
  const [categories, setCategories] = useState([]);
  const [isLeapsStateStale, setIsLeapsStateStale] = useState(true);
  const [leaps, setLeaps] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [error, setError] = useState(false);
  const [loadMore, setLoadMore] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [numOfLeaps, setNumOfLeaps] = useState(6);

  useEffect(() => {
    (async () => {
      setUser(await cache.get('user', 43200));
      const locationsObject = await locationsApi.getLocations();
      const locationsArr = locationsObject.data;

      setLocations(locationsArr);
      const getCategories = await categoriesApi.getCategories();

      setCategories(getCategories.data);
    })();
  }, [setUser, setCategories, setLocations, cache, locationsApi]);

  useEffect(() => {
    if (user && isLeapsStateStale && categories.length > 0 && !loading) {
      loadLeaps(loadMore);
    }
  }, [
    user,
    categories,
    isLeapsStateStale,
    loadLeaps,
    loadMore,
    filterCategory,
    filterLocation,
    loading,
  ]);

  const loadLeaps = async (loadMore) => {
    setLoading(true);
    setLoadingMore(true);

    const response = await getLeapsApi.getfilteredleaps(
      filterCategory?.id,
      filterLocation?.id,
      loadMore ? leaps.slice(-1)[0].id : undefined,
    );

    if (response.data?.errors?.[0]?.message === 'no valid token') {
      const deletedUser = await cache.deleteUser('user');

      await setUser(deletedUser);
      await logoutApi.logout();
    }

    if (!response.ok) {
      setLoading(false);
      setLoadingMore(false);

      return setError(true);
    }

    setNumOfLeaps(response.data.count);
    setError(false);
    if (loadMore) {
      const oldLeaps = [...leaps];
      const alteredLeaps = response.data.leaps.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      }));

      const newLeaps = oldLeaps.concat(alteredLeaps);

      setLoadMore(undefined);

      setIsLeapsStateStale(false);
      setLoading(false);
      setLoadingMore(false);
      return setLeaps(newLeaps);
    }

    setIsLeapsStateStale(false);
    setLoading(false);
    setLoadingMore(false);
    setLeaps(
      response.data.leaps.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      })),
    );
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <UsernameContext.Provider value={{ username, setUsername }}>
        <LocationsContext.Provider value={{ locations }}>
          <CategoriesContext.Provider value={{ categories }}>
            <LeapsContext.Provider value={{ leaps }}>
              <LeapsStateContext.Provider
                value={{ isLeapsStateStale, setIsLeapsStateStale }}
              >
                <FilterLocationContext.Provider
                  value={{ filterLocation, setFilterLocation }}
                >
                  <FilterCategoryContext.Provider
                    value={{ filterCategory, setFilterCategory }}
                  >
                    <ErrorContext.Provider value={{ error, setError }}>
                      <LoadMoreContext.Provider
                        value={{ loadMore, setLoadMore }}
                      >
                        <LoadingMoreContext.Provider
                          value={{ loadingMore, setLoadingMore }}
                        >
                          <NumOfLeapsContext.Provider value={{ numOfLeaps }}>
                            <NavigationContainer>
                              <Stack.Navigator>
                                {user ? (
                                  <Stack.Screen
                                    name="AppNavigator"
                                    component={AppNavigator}
                                    options={{ headerShown: false }}
                                  />
                                ) : (
                                  <>
                                    <Stack.Screen
                                      name="Welcome"
                                      component={WelcomeScreen}
                                      options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                      name="Login"
                                      component={LoginScreen}
                                    />
                                    <Stack.Screen
                                      name="Register"
                                      component={RegisterScreen}
                                    />
                                  </>
                                )}
                              </Stack.Navigator>
                            </NavigationContainer>
                          </NumOfLeapsContext.Provider>
                        </LoadingMoreContext.Provider>
                      </LoadMoreContext.Provider>
                    </ErrorContext.Provider>
                  </FilterCategoryContext.Provider>
                </FilterLocationContext.Provider>
              </LeapsStateContext.Provider>
            </LeapsContext.Provider>
          </CategoriesContext.Provider>
        </LocationsContext.Provider>
      </UsernameContext.Provider>
    </AuthContext.Provider>
  );
};
