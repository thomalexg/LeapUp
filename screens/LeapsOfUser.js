import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import getLeapsByUsernameApi from '../api/getLeapsByUsername';
import logoutApi from '../api/logout';
import CategoriesContext from '../auth/categoriesContext';
import AuthContext from '../auth/context';
import UsernameContext from '../auth/usernameContext';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import Icon from '../components/Icon';
import { ListItem } from '../components/lists';
import LeapItemSeparator from '../components/lists/LeapItemSeparator';
import ListFooterComponent from '../components/lists/ListFooterComponent';
import Screen from '../components/Screen';
import AppText from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';
import cache from '../utility/cache';
// import {useNetInfo} from 'react-native-community/netinfo';

function LeapsOfUser({ navigation }) {
  const usernameContext = useContext(UsernameContext);
  const authContext = useContext(AuthContext);
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numOfLeaps, setNumOfLeaps] = useState(6);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const categoriesContext = useContext(CategoriesContext);
  const categories = categoriesContext.categories;
  const netInfo = useNetInfo();

  useEffect(() => {
    loadLeaps();
  }, []);

  const loadLeaps = async (loadMore) => {
    setLoading(true);

    const response = await getLeapsByUsernameApi.getLeapsByUsername(
      usernameContext.username,
      loadMore ? leaps.slice(-1)[0].id : undefined,
    );

    if (response.data?.errors?.[0]?.message === 'no valid token') {
      const deletedUser = await cache.deleteUser('user');
      await authContext.setUser(deletedUser);
      await logoutApi.logout();
    }

    if (!response.ok) {
      setLoading(false);
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
      return setLeaps(newLeaps);
    }

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
    <Screen style={styles.screen}>
      {error && (
        <>
          <AppText>Couldn´t retrieve the leaps</AppText>
          <AppButton title="Refresh" onPress={loadLeaps} />
        </>
      )}
      <FlatList
        refreshing={refreshing}
        maintainVisibleContentPosition={true}
        onEndReached={() => {
          if (!loadingMore) {
            setLoadingMore(true);

            loadLeaps(true);
            setLoadingMore(false);
          }
        }}
        onEndReachedThreshold={0.5}
        onRefresh={() => {
          loadLeaps();
        }}
        data={leaps}
        keyExtractor={(leaps) => leaps.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            showIcon={true}
            style={styles.list}
            title={item.title}
            subTitle={item.description}
            onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
            IconComponent={
              <Icon
                backgroundColor={item.category?.backgroundColor || 'blue'}
                name={item.category?.icon || 'error'}
              />
            }
          />
        )}
        ItemSeparatorComponent={LeapItemSeparator}
        ListFooterComponent={() =>
          loading && numOfLeaps !== leaps.length ? (
            <ListFooterComponent
              children={<ActivityIndicator visible={true} />}
            />
          ) : numOfLeaps === leaps.length ? (
            <ListFooterComponent children={<Text>This is the end!</Text>} />
          ) : (
            <ListFooterComponent />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 30,
    backgroundColor: colors.light,
  },
});

export default LeapsOfUser;
