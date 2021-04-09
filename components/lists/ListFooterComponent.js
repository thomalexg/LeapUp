import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';

function ListFooterComponent({ children }) {
  return <View style={styles.separator}>{children}</View>;
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 90,
    backgroundColor: colors.light,
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },
});

export default ListFooterComponent;
