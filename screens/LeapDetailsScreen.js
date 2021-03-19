import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AuthContext from '../auth/context';
import UsernameContext from '../auth/usernameContext';
import Icon from '../components/Icon';
import ListItem from '../components/lists/ListItem';
import Text from '../components/Text';
import colors from '../config/colors';
import routes from '../navigation/routes';

function LeapDetailsScreen({ route, navigation }) {
  const authContext = useContext(AuthContext);
  const usernameContext = useContext(UsernameContext);
  const listing = route.params;
  return (
    <>

      <ScrollView>
        {/* <Image style={styles.image} source={require('../assets/jacket.jpg')} /> */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.description}>{listing.description}</Text>
          <View style={styles.userContainer}>
            <ListItem
              // image={require('../assets/thomas.jpg')}
              title={listing.username || 'No username available'}
              // subTitle="3 Leaps"
              IconComponent={
                <Icon name="account" backgroundColor={colors.third} />
              }
              onPress={() => {
                usernameContext.setUsername(listing.username);
                navigation.navigate(routes.LEAPS_OF_USER);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
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
    marginVertical: 20,
    color: colors.secondary,
    fontSize: 24,
    fontWeight: '500',
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default LeapDetailsScreen;
