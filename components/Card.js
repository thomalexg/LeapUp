import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../config/colors';
import Text from './Text';

function Card({ title, subTitle, image }) {
  return (
    <View style={styles.card}>
      {/* <Image style={styles.image} source={image} /> */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={3}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: 'hidden',
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  subTitle: {
    marginBottom: 7,
  },
});

export default Card;
