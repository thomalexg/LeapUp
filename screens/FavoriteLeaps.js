import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import deleteFavoriteLeapApi from '../api/deleteFavoriteLeap';
// import { FlatList } from 'react-native-gesture-handler';
import getFavoriteLeapsApi from '../api/getFavoriteLeaps';
import logoutApi from '../api/logout';
import AuthContext from '../auth/context';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import Card from '../components/Card';
import { ListItemDeleteAction } from '../components/lists';
import Screen from '../components/Screen';
import AppText from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';
import cache from '../utility/cache';
// import {useNetInfo} from 'react-native-community/netinfo';

function LeapsScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();

  useEffect(() => {
    loadLeaps();
  }, []);

  const loadLeaps = async () => {
    setLoading(true);
    const response = await getFavoriteLeapsApi.getFavoriteLeaps(
      authContext.user.value.id,
    );
    console.log('response of leaps', response.data.errors);
    setLoading(false);

    if (response.data?.errors?.[0]?.message === 'no valid token') {
      console.log('should delete user after this line');
      const deletedUser = await cache.deleteUser('user');
      console.log('deleteduser', deletedUser);
      authContext.setUser(deletedUser);
      await logoutApi.logout();
    }

    if (!response.ok) {
      setLoading(false);
      return setError(true);
    }

    setError(false);
    setLeaps(response.data);
  };
  if (!netInfo.isInternetReachable) {
    return (
      <Screen>
        <AppText>No internet connection</AppText>
      </Screen>
    );
  }

  const handleDelete = async (item) => {
    // console.log('item', item);
    await deleteFavoriteLeapApi.deleteFavoriteLeap(
      item,
      authContext.user.value,
    );
    loadLeaps();
  };

  return (
    <Screen style={styles.screen}>
      {error && (
        <>
          <AppText>Couldn´t retrieve the leaps</AppText>
          <AppButton title="Refresh" onPress={loadLeaps} />
        </>
      )}
      {/* {network.isInternetReachable && alert('No internet connection')} */}
      <ActivityIndicator visible={loading} />
      <FlatList
        refreshing={refreshing}
        onRefresh={() => {
          loadLeaps();
        }}
        data={leaps.sort((a, b) => a.id < b.id)}
        keyExtractor={(leaps) => leaps.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={item.description}
            // image={leap.image}
            onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default LeapsScreen;
