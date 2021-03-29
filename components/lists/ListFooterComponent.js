import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';

function ListFooterComponent({ children }) {
  return <View style={styles.separator}>{children}</View>;
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 70,
    backgroundColor: colors.light,
  },
});

export default ListFooterComponent;
