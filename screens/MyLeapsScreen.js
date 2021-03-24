import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import deleteLeapApi from '../api/deleteLeap';
import logoutApi from '../api/logout';
// import { FlatList } from 'react-native-gesture-handler';
import myLeapsApi from '../api/myLeaps';
import AuthContext from '../auth/context';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import { ListItem, ListItemDeleteAction } from '../components/lists';
import LeapItemSeparator from '../components/lists/LeapItemSeparator';
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
    console.log('this should be the user id', authContext.user.value.id);
    const response = await myLeapsApi.getMyLeaps(authContext.user.value.id);
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
    await deleteLeapApi.deleteLeap(item);
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
          <ListItem
            showIcon={true}
            style={styles.list}
            title={item.title}
            subTitle={item.description}
            onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
            renderRightActions={() => (
              <ListItemDeleteAction
                style={{ marginBottom: 10, borderRadius: 25 }}
                onPress={() => handleDelete(item)}
              />
            )}
            ItemSeparatorComponent={LeapItemSeparator}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    backgroundColor: colors.light,
  },
});

export default LeapsScreen;
