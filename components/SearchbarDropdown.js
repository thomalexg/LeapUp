import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import LocationsContext from '../auth/locationContext';
import defaultStyles from '../config/styles';
import ListDropdown from './lists/ListDropdown';

function SearchbarDropdown({
  icon,
  width = '100%',
  items,
  numberOfColumns = 1,
}) {
  const locationsContext = useContext(LocationsContext);
  const locations = locationsContext.locations;
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(items);
  const [city, setCity] = useState('');
  const onSearch = (value) => {
    setIsSearching(true);
    setCity(value);
    setSearch(value.toLowerCase());
    setFilteredLocations(
      locations.filter(
        (location) =>
          location.city.toLowerCase().indexOf(search) > -1 ||
          location.country.toLowerCase().indexOf(search) > -1 ||
          location.state.toLowerCase().indexOf(search) > -1,
      ),
    );
  };
  // console.log('filteredLocations:', filteredLocations);
  return (
    <>
      <View style={[styles.container, { width }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[defaultStyles.text]}
          placeholder="Search for your location"
          onChangeText={onSearch}
          value={city}
          onBlur={() => setIsSearching(false)}
        />
      </View>
      {isSearching && (
        <View style={styles.list}>
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numberOfColumns}
            renderItem={(item) => (
              <TouchableHighlight onPress={() => setCity(item.item.city)}>
                <ListDropdown
                  item={item}
                />
              </TouchableHighlight>
            )}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {},
  list: {
    backgroundColor: 'whitesmoke',
  },
});

export default SearchbarDropdown;
