import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CategoriesContext from '../auth/categoriesContext';
import ErrorContext from '../auth/errorContext';
import FilterCategoryContext from '../auth/filterCategoryContext';
import FilterLocationContext from '../auth/filterLocationContext';
import LeapsContext from '../auth/leapsContext';
import LeapsStateContext from '../auth/leapsStateContext';
import LoadMoreContext from '../auth/loadMoreContext';
import LocationsContext from '../auth/locationContext';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import CategoryPickerItem from '../components/CategoryPickerItem';
import { Form, FormPicker as Picker, SubmitButton } from '../components/forms';
import Icon from '../components/Icon';
import { ListItem } from '../components/lists';
import LeapItemSeparator from '../components/lists/LeapItemSeparator';
import ListFooterComponent from '../components/lists/ListFooterComponent';
import Screen from '../components/Screen';
import SearchbarDropdown from '../components/SearchbarDropdown';
import AppText from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';

// import {useNetInfo} from 'react-native-community/netinfo';

function LeapsScreen({ navigation }) {
  // const authContext = useContext(AuthContext);
  const [leaps, setLeaps] = useState([]);
  // const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // const [filterLocation, setFilterLocation] = useState('');
  // const [filterCategory, setFilterCategory] = useState('');
  const locationsContext = useContext(LocationsContext);
  const categoriesContext = useContext(CategoriesContext);
  const categories = categoriesContext.categories;
  const locations = locationsContext.locations;
  const leapsContext = useContext(LeapsContext);
  const leapsFromContext = leapsContext.leaps;
  const leapsStateContext = useContext(LeapsStateContext);
  filterCategoryContext = useContext(FilterCategoryContext);
  const filterLocationContext = useContext(FilterLocationContext);
  const errorContext = useContext(ErrorContext);
  const loadMoreContext = useContext(LoadMoreContext);

  // console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();
  // let lastLoadedLeapId = '';
  // const [lastLoadedLeapId, setLastLoadedLeapId] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  // if (leaps === []) {
  //   console.log('This shit is running');
  //   return leapsStateContext.setIsLeapsSateStale(true);
  // }
  // console.log('leaps of leapsScreen', leaps);
  useEffect(() => {
    // console.log('This shit is running');
    // if (leaps !== []) {
    //   setLeaps(...leaps, leapsFromContext);
    // }
    setLeaps(leapsFromContext);
  }, [leapsFromContext]);

  const handleSubmit = (filter) => {
    console.log('filter', filter);
    setModalVisible(false);
    // setLeaps([]);
    filterCategoryContext.setFilterCategory(
      filter.category !== '' ? filter.category : undefined,
    );
    filterLocationContext.setFilterLocation(
      filter.location !== '' ? filter.location : undefined,
    );
    leapsStateContext.setIsLeapsStateStale(true);
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
      <View style={styles.icon}>
        <TouchableWithoutFeedback
          underlayColor={colors.light}
          onPress={() => {
            setModalVisible(true);
          }}

          // onPress={() => alert('Pressed')}
        >
          <View>
            {/* <Text>Button</Text> */}
            <Icon
              name="filter"
              backgroundColor={colors.secondary}
              size={60}
              // onPress={() => alert('Pressed')}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* <View>
        <FilterButton
          title="filter"
          color="third"
          onPress={() => setModalVisible(true)}
        />
      </View> */}
      {errorContext.error && (
        <>
          <AppText>Couldn´t retrieve the leaps</AppText>
          <AppButton
            title="Refresh"
            onPress={() => {
              return leapsStateContext.setIsLeapsStateStale(true);
            }}
          />
        </>
      )}
      {/* {network.isInternetReachable && alert('No internet connection')} */}
      <ActivityIndicator visible={loading} />
      <View style={{ backgroundColor: 'transparent' }}>
        <FlatList
          refreshing={refreshing}
          maintainVisibleContentPosition={true}
          onEndReached={() => {
            if (!loadingMore) {
              setLoadingMore(true);
              leapsStateContext.setIsLeapsStateStale(true);

              loadMoreContext.setLoadMore(true);
              // loadLeaps(true);
              console.log('Running');
              setLoadingMore(false);
            }
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() => {
            console.log('Running refresh');
            return leapsStateContext.setIsLeapsStateStale(true);
          }}
          // data={leaps.sort((a, b) => a.id < b.id)}
          data={leaps === [] ? leaps : leaps}
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
          // ListFooterComponent={ListFooterComponent}
          ListFooterComponent={() =>
            loadingMore ? (
              <ListFooterComponent children={<Text>Loading</Text>} />
            ) : (
              <ListFooterComponent />
            )
          }
        />
      </View>
      {/* <View style={styles.bottom} /> */}
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <AppButton
            title="Close"
            color="third"
            onPress={() => setModalVisible(false)}
          />
          <Form
            initialValues={{
              category: filterCategoryContext.filterCategory,
              location: filterLocationContext.filterLocation,
            }}
            onSubmit={handleSubmit}
          >
            <Picker
              items={categories}
              name="category"
              numberOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder={
                filterCategoryContext.filterCategory === '' ||
                filterCategoryContext.filterCategory === undefined
                  ? 'Category'
                  : filterCategoryContext.filterCategory.category
              }
              width="50%"
            />
            <SearchbarDropdown
              name="location"
              numberOfColumns={1}
              items={locations}
              placeholder={
                filterLocationContext.filterLocation === '' ||
                filterLocationContext.filterLocation === undefined
                  ? 'Search for your location'
                  : filterLocationContext.filterLocation.city
              }
              // setStadt={setStadt}
            />

            <SubmitButton title="Apply Filter" />
          </Form>

          <AppButton
            title="Reset Filter"
            color="third"
            onPress={() => {
              filterCategoryContext.setFilterCategory('');
              filterLocationContext.setFilterLocation('');

              // setLeaps([]);
              leapsStateContext.setIsLeapsStateStale(true);
              setModalVisible(false);
            }}
          />
        </Screen>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 30,
    backgroundColor: colors.light,
  },
  icon: {
    zIndex: 3,
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 1,
  },
  list: {
    borderStyle: 'solid',
    borderBottomColor: 'black',
  },
  bottom: {
    width: '100%',
    height: 500,
    backgroundColor: colors.light,
  },
});

export default LeapsScreen;

// const loadLeaps = async (loadMore) => {
//   setLoading(true);
//   console.log('location:', filterLocation);
//   console.log('category:', filterCategory);

//   // const response = await leapsApi.getLeaps();
//   const response = await getLeapsApi.getfilteredleaps(
//     filterCategory?.id,
//     filterLocation?.id,
//     loadMore ? leaps.slice(-1)[0].id : undefined,
//   );
//   // console.log('response of leaps', response.data.errors);
//   setLoading(false);

//   if (response.data?.errors?.[0]?.message === 'no valid token') {
//     // console.log('should delete user after this line');
//     const deletedUser = await cache.deleteUser('user');
//     console.log('deleteduser', deletedUser);
//     await authContext.setUser(deletedUser);
//     await logoutApi.logout();
//   }

//   if (!response.ok) {
//     setLoading(false);
//     return setError(true);
//   }

//   setError(false);
//   if (loadMore) {
//     const oldLeaps = [...leaps];
//     const alteredLeaps = response.data.map((leap) => ({
//       ...leap,
//       category: categories.find(
//         (category) => category.id === leap.categoryId,
//       ),
//     }));
//     console.log('oldLeaps', oldLeaps.length);
//     console.log('alteredLeaps', alteredLeaps.length);
//     const newLeaps = oldLeaps.concat(alteredLeaps);
//     console.log('newLeaps', newLeaps.length);
//     return setLeaps(newLeaps);
//   }
//   // setLeaps(
//   //   response.data.map((leap) => ({
//   //     ...leap,
//   //     category: categories.find(
//   //       (category) => category.id === leap.category_id,
//   //     ),
//   //   })),
//   // );
//   console.log(
//     response.data.map((leap) => ({
//       ...leap,
//       category: categories.find(
//         (category) => category.id === leap.categoryId,
//       ),
//     })),
//   );
//   setLeaps(
//     response.data.map((leap) => ({
//       ...leap,
//       category: categories.find(
//         (category) => category.id === leap.categoryId,
//       ),
//     })),
//   );
//   // lastLoadedLeapId = response.data.slice(-1)[0].id;
//   // console.log('response', response.data.slice(-1)[0].id);
//   // setLastLoadedLeapId(response?.data?.slice(-1)[0]?.id || 1);
// };
