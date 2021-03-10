import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Card from '../components/Card';
import Screen from '../components/Screen';
import colors from '../config/colors';

const listings = [
  {
    id: 1,
    title: 'Want to learn JavaScript from scratch',
    description:
      'Hi guys, I just started programming and thought it would be much more fun to learn it together. I just started so I just know the basics. If you are at the same stage as me, I would be happy to hear from you!',
  },
  {
    id: 2,
    title: 'Finally want to play the guitar',
    description:
      'Hi guys, I started playing the guitar a coupöle of times now, but always loose motivation after starting. Would be nice to learn it with someone who is at the same stage.',
  },
];

function LeapsScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => navigation.navigate('Leap', item)}
          />
        )}
      />
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
