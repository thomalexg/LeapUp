import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import { matchSorter } from 'match-sorter';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import LocationsContext from '../auth/locationContext';
import defaultStyles from '../config/styles';
import { ErrorMessage } from './forms';
import { ListItem } from './lists';

function SearchbarDropdown({
  icon,
  width = '100%',
  items,
  numberOfColumns = 1,
  name,
  placeholder,
  cityReset,
  setCityReset,
}) {
  const { setFieldValue, errors, touched } = useFormikContext();

  const locationsContext = useContext(LocationsContext);
  const locations = locationsContext.locations;

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(items);
  const [city, setCity] = useState('');

  useEffect(() => {
    function resetCity() {
      if (cityReset) {
        setCity('');
        setCityReset(false);
      }
    }
    resetCity();
  }, [cityReset, setCityReset]);

  const onSearch = (value) => {
    setIsSearching(true);
    setCity(value);
    setSearch(value.toLowerCase());
    setFilteredLocations(
      matchSorter(locations, search, { keys: ['city', 'country', 'state'] }),
    );

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
            placeholder={placeholder}
            onChangeText={onSearch}
            value={city}
          />
        </View>
        {isSearching &&
          filteredLocations.map((v, i) => (
            <View key={v.id}>
              <ListItem
                key={v.city}
                title={v.city}
                onPress={() => {
                  setCity(v.city);
                  setFieldValue('location', v);
                  setIsSearching(false);
                }}
              ></ListItem>
            </View>
          ))}
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </>
    );
  };

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
      position: 'relative',
      zIndex: 11,
    },
  });
}
export default SearchbarDropdown;
