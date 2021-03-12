import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import ListItem from '../components/lists/ListItem';
import Text from '../components/Text';
import colors from '../config/colors';

function LeapDetailsScreen({ route }) {
  const listing = route.params;
  return (
    <ScrollView>
      <Image style={styles.image} source={require('../assets/jacket.jpg')} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <View style={styles.userContainer}>
          <ListItem
            image={require('../assets/thomas.jpg')}
            title="thomalex"
            subTitle="3 Leaps"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  description: {
    color: colors.dark,
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    color: colors.secondary,
    fontSize: 24,
    fontWeight: '500',
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default LeapDetailsScreen;
