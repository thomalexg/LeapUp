import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import categoriesApi from '../api/categories';
// import { FlatList } from 'react-native-gesture-handler';
// import leapsApi from '../api/leaps';
import getLeapsApi from '../api/getLeaps';
import AuthContext from '../auth/context';
import LocationsContext from '../auth/locationContext';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import Card from '../components/Card';
import CategoryPickerItem from '../components/CategoryPickerItem';
import FilterButton from '../components/FilterButton';
import { Form, FormPicker as Picker, SubmitButton } from '../components/forms';
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
  const [categories, setCategories] = useState([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const locationsContext = useContext(LocationsContext);
  const locations = locationsContext.locations;
  // console.log('leaps', leaps[0]);
  const netInfo = useNetInfo();

  useEffect(() => {
    loadLeaps();
    const categorieFunc = async () => {
      const getCategories = await categoriesApi.getCategories();
      // console.log('The categories should be here:', getCategories.data);
      setCategories(getCategories.data);
    };
    categorieFunc();
  }, []);

  const handleSubmit = (filter) => {
    console.log('filter', filter);
    setModalVisible(false);
    setFilterCategory(filter.category ? filter.category : undefined);
    setFilterLocation(filter.location);
    loadLeaps();
  };

  const loadLeaps = async () => {
    setLoading(true);
    console.log('location:', filterLocation);
    console.log('category:', filterCategory);
    // const response = await leapsApi.getLeaps();
    const response = await getLeapsApi.getfilteredleaps(
      filterCategory.id,
      filterLocation.id,
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
      <View>
        <FilterButton
          title="filter"
          color="third"
          onPress={() => setModalVisible(true)}
        />
      </View>
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
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <AppButton title="Close" onPress={() => setModalVisible(false)} />
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
                filterCategory === '' ? 'Category' : filterCategory.category
              }
              width="50%"
            />
            <SearchbarDropdown
              name={filterLocation === '' ? 'location' : filterLocation.city}
              numberOfColumns={1}
              items={locations}
              // setStadt={setStadt}
            />

            <SubmitButton title="Apply Filter" />
          </Form>

          <AppButton
            title="Reset Filter"
            onPress={() => {
              setFilterCategory('');
              setFilterLocation('');
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
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default LeapsScreen;
