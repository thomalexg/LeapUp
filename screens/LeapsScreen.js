import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
import leapsApi from '../api/leaps';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import AppText from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';
// import {useNetInfo} from 'react-native-community/netinfo';

function LeapsScreen({ navigation }) {
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();

  fetch('https://www.npmjs.com/package/moment');

  useEffect(() => {
    loadLeaps();
  }, []);

  const loadLeaps = async () => {
    setLoading(true);
    const response = await leapsApi.getLeaps();
    // console.log(response);
    setLoading(false);
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
