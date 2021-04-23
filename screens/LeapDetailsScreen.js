import Clipboard from 'expo-clipboard';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, TouchableHighlight, View } from 'react-native';
import favoriteApi from '../api/saveLeapAsFavorite';
import AuthContext from '../auth/context';
import LocationsContext from '../auth/locationContext';
import UsernameContext from '../auth/usernameContext';
import Icon from '../components/Icon';
import ListItem from '../components/lists/ListItem';
import Screen from '../components/Screen';
import Text from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';

function LeapDetailsScreen({ route, navigation }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const authContext = useContext(AuthContext);
  const usernameContext = useContext(UsernameContext);
  const locationsContext = useContext(LocationsContext);
  const locations = locationsContext.locations;
  const listing = route.params;
  const location = locations.filter(
    (location) => location.id === listing.locationId,
  )[0];

  function clipboard() {
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1000);
  }
  function favourit() {
    setSaved(true);
    setTimeout(function () {
      setSaved(false);
    }, 1000);
  }
  function already() {
    setAlreadySaved(true);
    setTimeout(function () {
      setAlreadySaved(false);
    }, 1000);
  }

  function failedToSafe() {
    setFailed(true);
    setTimeout(function () {
      setFailed(false);
    }, 1000);
  }

  async function saveAsFav() {
    const response = await favoriteApi.saveLeapAsFavorite(
      authContext.user.value.id,
      listing.id,
    );
    if (response.data?.errors?.[0]?.message === 'leap already saved') {
      already();
      return;
    }
    if (!response.ok) {
      failedToSafe();
      return;
    }
    favourit();
  }
  return (
    <Screen>
      <View style={styles.icon}>
        <TouchableHighlight
          underlayColor={colors.light}
          onPress={() => {
            saveAsFav();
          }}
        >
          <View>
            <Icon name="star" backgroundColor={colors.primary} />
          </View>
        </TouchableHighlight>
      </View>
      {copied && (
        <View style={styles.copy}>
          <Text style={styles.email}>Copied {listing.email}</Text>
        </View>
      )}
      {saved && (
        <View style={styles.copy}>
          <Text style={styles.email}>Leap is now in your favourites!</Text>
        </View>
      )}
      {alreadySaved && (
        <View style={styles.copy}>
          <Text style={styles.email}>Leap is already in your favourites!</Text>
        </View>
      )}
      {failed && (
        <View style={styles.copy}>
          <Text style={styles.email}>Failed to save leap, try again!</Text>
        </View>
      )}
      <ScrollView>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.description}>{listing.description}</Text>
          <View style={styles.userContainer}>
            <ListItem
              showIcon={true}
              title={listing.username || 'No username available'}
              IconComponent={
                <Icon name="account" backgroundColor={colors.secondary} />
              }
              onPress={() => {
                usernameContext.setUsername(listing.username);
                navigation.navigate(routes.LEAPS_OF_USER);
              }}
            />
            <ListItem
              showCopy={true}
              showIcon={false}
              title={listing.email || 'Error'}
              IconComponent={
                <Icon name="email" backgroundColor={colors.medium} />
              }
              onPress={async () => {
                const email = listing.email;

                Clipboard.setString(email);
                clipboard();
              }}
            />
            <ListItem
              showIcon={false}
              title={location?.city || 'No location available'}
              IconComponent={
                <Icon name="city-variant" backgroundColor={colors.secondary} />
              }
            />
            <ListItem
              showIcon={false}
              title={listing.category?.category || 'No category available'}
              IconComponent={
                <Icon
                  name={listing.category.icon}
                  backgroundColor={listing.category.backgroundColor}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    position: 'relative',
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
    marginVertical: 20,
    color: colors.third,
    fontSize: 24,
    fontWeight: '500',
  },
  userContainer: {
    marginVertical: 40,
  },
  icon: {
    zIndex: 3,
    position: 'absolute',
    top: 40,
    right: 15,
  },
  copy: {
    backgroundColor: 'rgba(72, 255, 150, 1)',
    borderRadius: 10,
    zIndex: 3,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  email: {
    color: colors.dark,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default LeapDetailsScreen;
