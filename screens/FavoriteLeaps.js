import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import deleteFavoriteLeapApi from '../api/deleteFavoriteLeap';
import getFavoriteLeapsApi from '../api/getFavoriteLeaps';
import logoutApi from '../api/logout';
import CategoriesContext from '../auth/categoriesContext';
import AuthContext from '../auth/context';
import UsernameContext from '../auth/usernameContext';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import Icon from '../components/Icon';
import { ListItem, ListItemDeleteAction } from '../components/lists';
import LeapItemSeparator from '../components/lists/LeapItemSeparator';
import ListFooterComponent from '../components/lists/ListFooterComponent';
import Screen from '../components/Screen';
import AppText from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';
import cache from '../utility/cache';
// import {useNetInfo} from 'react-native-community/netinfo';

function MyLeapsScreen({ navigation }) {
  const usernameContext = useContext(UsernameContext);
  const authContext = useContext(AuthContext);
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const categoriesContext = useContext(CategoriesContext);
  const categories = categoriesContext.categories;
  // console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();

  useEffect(() => {
    loadLeaps();
  }, []);

  const loadLeaps = async (loadMore) => {
    setLoading(true);
    console.log('user of my leaps:', authContext.user);
    // const response = await leapsApi.getLeaps();
    const response = await getFavoriteLeapsApi.getFavoriteLeaps(
      authContext.user.value.id,
      loadMore ? leaps.slice(-1)[0].id : undefined,
    );
    // console.log('response of leaps', response.data.errors);
    setLoading(false);

    if (response.data?.errors?.[0]?.message === 'no valid token') {
      // console.log('should delete user after this line');
      const deletedUser = await cache.deleteUser('user');
      console.log('deleteduser', deletedUser);
      await authContext.setUser(deletedUser);
      await logoutApi.logout();
    }

    if (!response.ok) {
      setLoading(false);
      return setError(true);
    }

    setError(false);
    if (loadMore) {
      const oldLeaps = [...leaps];
      const alteredLeaps = response.data.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      }));
      // console.log('oldLeaps', oldLeaps.length);
      // console.log('alteredLeaps', alteredLeaps.length);
      const newLeaps = oldLeaps.concat(alteredLeaps);
      // console.log('newLeaps', newLeaps.length);
      return setLeaps(newLeaps);
    }

    setLeaps(
      response.data.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      })),
    );
  };

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
        maintainVisibleContentPosition={true}
        onEndReached={() => {
          if (!loadingMore) {
            setLoadingMore(true);

            loadLeaps(true);
            console.log('Running');
            setLoadingMore(false);
          }
        }}
        onEndReachedThreshold={0.5}
        onRefresh={() => {
          loadLeaps();
        }}
        // data={leaps.sort((a, b) => a.id < b.id)}
        data={leaps}
        keyExtractor={(leaps) => leaps.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            showIcon={true}
            style={styles.list}
            title={item.title}
            subTitle={item.description}
            onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
            IconComponent={
              <Icon
                backgroundColor={item.category?.backgroundColor || 'blue'}
                name={item.category?.icon || 'error'}
              />
            }
          />
        )}
        ItemSeparatorComponent={LeapItemSeparator}
        // ListFooterComponent={ListFooterComponent}
        ListFooterComponent={() =>
          loadingMore ? (
            <ListFooterComponent children={<Text>Loading</Text>} />
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

export default MyLeapsScreen;

// import { useNetInfo } from '@react-native-community/netinfo';
// import React, { useContext, useEffect, useState } from 'react';
// import { FlatList, StyleSheet } from 'react-native';
// import deleteFavoriteLeapApi from '../api/deleteFavoriteLeap';
// // import { FlatList } from 'react-native-gesture-handler';
// import getFavoriteLeapsApi from '../api/getFavoriteLeaps';
// import logoutApi from '../api/logout';
// import AuthContext from '../auth/context';
// import ActivityIndicator from '../components/ActivityIndicator';
// import AppButton from '../components/Button';
// import Card from '../components/Card';
// import { ListItemDeleteAction } from '../components/lists';
// import Screen from '../components/Screen';
// import AppText from '../components/Text';
// import colors from '../config/colors';
// import routes from '../navigation/routes';
// import cache from '../utility/cache';
// // import {useNetInfo} from 'react-native-community/netinfo';

// function LeapsScreen({ navigation }) {
//   const authContext = useContext(AuthContext);
//   const [leaps, setLeaps] = useState([]);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   // console.log('leaps', leaps[0]);
//   const netInfo = useNetInfo();

//   useEffect(() => {
//     loadLeaps();
//   }, []);

//   const loadLeaps = async () => {
//     setLoading(true);
//     const response = await getFavoriteLeapsApi.getFavoriteLeaps(
//       authContext.user.value.id,
//     );
//     console.log('response of leaps', response.data.errors);
//     setLoading(false);

//     if (response.data?.errors?.[0]?.message === 'no valid token') {
//       console.log('should delete user after this line');
//       const deletedUser = await cache.deleteUser('user');
//       console.log('deleteduser', deletedUser);
//       authContext.setUser(deletedUser);
//       await logoutApi.logout();
//     }

//     if (!response.ok) {
//       setLoading(false);
//       return setError(true);
//     }

//     setError(false);
//     setLeaps(response.data);
//   };
//   if (!netInfo.isInternetReachable) {
//     return (
//       <Screen>
//         <AppText>No internet connection</AppText>
//       </Screen>
//     );
//   }

//   const handleDelete = async (item) => {
//     // console.log('item', item);
//     await deleteFavoriteLeapApi.deleteFavoriteLeap(
//       item,
//       authContext.user.value,
//     );
//     loadLeaps();
//   };

//   return (
//     <Screen style={styles.screen}>
//       {error && (
//         <>
//           <AppText>Couldn´t retrieve the leaps</AppText>
//           <AppButton title="Refresh" onPress={loadLeaps} />
//         </>
//       )}
//       {/* {network.isInternetReachable && alert('No internet connection')} */}
//       <ActivityIndicator visible={loading} />
//       <FlatList
//         refreshing={refreshing}
//         onRefresh={() => {
//           loadLeaps();
//         }}
//         data={leaps.sort((a, b) => a.id < b.id)}
//         keyExtractor={(leaps) => leaps.id.toString()}
//         renderItem={({ item }) => (
//           <Card
//             title={item.title}
//             subTitle={item.description}
//             // image={leap.image}
//             onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
//             renderRightActions={() => (
//               <ListItemDeleteAction onPress={() => handleDelete(item)} />
//             )}
//           />
//         )}
//       />
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     padding: 20,
//     backgroundColor: colors.light,
//   },
// });

// export default LeapsScreen;
