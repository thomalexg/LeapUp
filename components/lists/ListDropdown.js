import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import Text from '../Text';

function ListDropdown({ item, onPress }) {
  // console.log('city', item.item.city);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.city} numberOfLines={1}>
          {item.item.city}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 11,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  country: {
    color: colors.medium,
  },
  city: {
    fontWeight: '500',
  },
});

export default ListDropdown;
