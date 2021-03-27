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
import getLeapsApi from '../api/getLeaps';
import CategoriesContext from '../auth/categoriesContext';
import AuthContext from '../auth/context';
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
import cache from '../utility/cache';

// import {useNetInfo} from 'react-native-community/netinfo';

function LeapsScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [leaps, setLeaps] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const locationsContext = useContext(LocationsContext);
  const categoriesContext = useContext(CategoriesContext);
  const categories = categoriesContext.categories;
  const locations = locationsContext.locations;
  // console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();
  // let lastLoadedLeapId = '';
  // const [lastLoadedLeapId, setLastLoadedLeapId] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadLeaps();
    // const categorieFunc = async () => {
    //   const getCategories = await categoriesApi.getCategories();
    //   // console.log('The categories should be here:', getCategories.data);
    //   setCategories(getCategories.data);
    // };
    // categorieFunc();
  }, [filterCategory, filterLocation]);

  const handleSubmit = (filter) => {
    console.log('filter', filter);
    setModalVisible(false);
    setLeaps([]);
    setFilterCategory(filter.category !== '' ? filter.category : undefined);
    setFilterLocation(filter.location !== '' ? filter.location : undefined);
  };

  const loadLeaps = async (loadMore) => {
    setLoading(true);
    console.log('location:', filterLocation);
    console.log('category:', filterCategory);

    // const response = await leapsApi.getLeaps();
    const response = await getLeapsApi.getfilteredleaps(
      filterCategory?.id,
      filterLocation?.id,
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
      console.log('oldLeaps', oldLeaps.length);
      console.log('alteredLeaps', alteredLeaps.length);
      const newLeaps = oldLeaps.concat(alteredLeaps);
      console.log('newLeaps', newLeaps.length);
      return setLeaps(newLeaps);
    }
    // setLeaps(
    //   response.data.map((leap) => ({
    //     ...leap,
    //     category: categories.find(
    //       (category) => category.id === leap.category_id,
    //     ),
    //   })),
    // );
    console.log(
      response.data.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      })),
    );
    setLeaps(
      response.data.map((leap) => ({
        ...leap,
        category: categories.find(
          (category) => category.id === leap.categoryId,
        ),
      })),
    );
    // lastLoadedLeapId = response.data.slice(-1)[0].id;
    // console.log('response', response.data.slice(-1)[0].id);
    // setLastLoadedLeapId(response?.data?.slice(-1)[0]?.id || 1);
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
      {error && (
        <>
          <AppText>Couldn´t retrieve the leaps</AppText>
          <AppButton title="Refresh" onPress={loadLeaps} />
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
              IconComponent={
                <Icon
                  backgroundColor={item.category?.backgroundColor || 'blue'}
                  name={item.category?.icon || 'error'}
                />
              }
            />
            // <Card
            //   title={item.title}
            //   subTitle={item.description}
            //   // image={leap.image}
            //   onPress={() => navigation.navigate(routes.LEAP_DETAILS, item)}
            // />
          )}
          ItemSeparatorComponent={LeapItemSeparator}
          ListFooterComponent={ListFooterComponent}
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
              category: filterCategory,
              location: filterLocation,
            }}
            onSubmit={handleSubmit}
          >
            <Picker
              items={categories}
              name="category"
              numberOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder={
                filterCategory === '' || filterCategory === undefined
                  ? 'Category'
                  : filterCategory.category
              }
              width="50%"
            />
            <SearchbarDropdown
              name="location"
              numberOfColumns={1}
              items={locations}
              placeholder={
                filterLocation === '' || filterLocation === undefined
                  ? 'Search for your location'
                  : filterLocation.city
              }
              // setStadt={setStadt}
            />

            <SubmitButton title="Apply Filter" />
          </Form>

          <AppButton
            title="Reset Filter"
            color="third"
            onPress={() => {
              setFilterCategory('');
              setFilterLocation('');

              setLeaps([]);
              loadLeaps();
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
    height: 300,
    backgroundColor: colors.light,
  },
});

export default LeapsScreen;
