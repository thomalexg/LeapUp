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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CategoriesContext from '../auth/categoriesContext';
import ErrorContext from '../auth/errorContext';
import FilterCategoryContext from '../auth/filterCategoryContext';
import FilterLocationContext from '../auth/filterLocationContext';
import LeapsContext from '../auth/leapsContext';
import LeapsStateContext from '../auth/leapsStateContext';
import LoadingMoreContext from '../auth/loadingMoreContext';
import LoadMoreContext from '../auth/loadMoreContext';
import LocationsContext from '../auth/locationContext';
import NumOfLeapsContext from '../auth/numOfLeapsContext';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/Button';
import CategoryPickerItem from '../components/CategoryPickerItem';
import { Form, FormPicker as Picker, SubmitButton } from '../components/forms';
import Icon from '../components/Icon';
import { ListItem } from '../components/lists';
import LeapItemSeparator from '../components/lists/LeapItemSeparator';
import ListFooterComponent from '../components/lists/ListFooterComponent';
import NoInternetIndicator from '../components/noInternetAnimation';
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
  const loadingMoreContext = useContext(LoadingMoreContext);
  const loadingMore = loadingMoreContext.loadingMore;
  const numOfLeapsContext = useContext(NumOfLeapsContext);
  const numOfLeaps = numOfLeapsContext.numOfLeaps;

  const netInfo = useNetInfo();

  useEffect(() => {
    setLeaps(leapsFromContext);
  }, [leapsFromContext]);

  const handleSubmit = (filter) => {
    setModalVisible(false);
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
        <View style={styles.internet}>
          <Text style={styles.internetText}>No Internet</Text>
          <NoInternetIndicator visible={true} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.icon}>
        <TouchableWithoutFeedback
          testID="filter"
          underlayColor={colors.light}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <View>
            <Icon name="filter" backgroundColor={colors.secondary} size={60} />
          </View>
        </TouchableWithoutFeedback>
      </View>
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
      <ActivityIndicator visible={loading} />
      <View style={{ backgroundColor: 'transparent' }}>
        <FlatList
          refreshing={refreshing}
          maintainVisibleContentPosition={true}
          onEndReached={() => {
            if (!loadingMore) {
              loadingMoreContext.setLoadingMore(true);
              leapsStateContext.setIsLeapsStateStale(true);

              loadMoreContext.setLoadMore(true);
              loadingMoreContext.setLoadingMore(false);
            }
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() => {
            return leapsStateContext.setIsLeapsStateStale(true);
          }}
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
          ListFooterComponent={() =>
            loadingMore && numOfLeaps !== leaps.length ? (
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
      </View>
      <Modal testID="modal" visible={modalVisible} animationType="slide">
        <Screen>
          <AppButton
            title="Close"
            color="third"
            onPress={() => setModalVisible(false)}
          />
          <KeyboardAwareScrollView extraHeight={600} nestedScrollEnabled={true}>
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
              />

              <SubmitButton title="Apply Filter" />
            </Form>

            <AppButton
              title="Reset Filter"
              color="third"
              onPress={() => {
                filterCategoryContext.setFilterCategory('');
                filterLocationContext.setFilterLocation('');

                leapsStateContext.setIsLeapsStateStale(true);
                setModalVisible(false);
              }}
            />
          </KeyboardAwareScrollView>
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
  internet: {
    position: 'relative',
    flex: 1,
    textAlign: 'center',
  },
  internetText: {},
});

export default LeapsScreen;
