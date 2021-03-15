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

// import routes from '../navigation/routes';

// const listings = [
//   {
//     id: 1,
//     title: 'Want to learn JavaScript from scratch',
//     description:
//       'Hi guys, I just started programming and thought it would be much more fun to learn it together. I just started so I just know the basics. If you are at the same stage as me, I would be happy to hear from you!',
//   },
//   {
//     id: 2,
//     title: 'Finally want to play the guitar',
//     description:
//       'Hi guys, I started playing the guitar a coupöle of times now, but always loose motivation after starting. Would be nice to learn it with someone who is at the same stage.',
//   },
// ];
// const getLeaps = async () => {
//   try {
//     let response = await fetch('https://127.0.0.1:3000/api/leaps/api/leaps');
//     let json = await response.json();
//     setLeaps(json);
//   } catch (error) {
//     console.error(error);
//   }
// };

function LeapsScreen({ navigation }) {
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // console.log('leaps', leaps[0]);

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

  return (
    <Screen style={styles.screen}>
      {error && (
        <>
          <AppText>Couldn´t retrieve the leaps</AppText>
          <AppButton title="Refresh" onPress={loadLeaps} />
        </>
      )}
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
