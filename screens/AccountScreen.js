import React, { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import logoutApi from '../api/logout';
import AuthContext from '../auth/context';
import Icon from '../components/Icon';
import { ListItem, ListItemSeparator } from '../components/lists';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';
import cache from '../utility/cache';

const menuItems = [
  {
    title: 'My Leaps',
    icon: {
      name: 'format-list-bulleted',
      backgroundColor: colors.primary,
    },
    targetScreen: routes.MYLEAPS,
  },
  {
    title: 'Favourites',
    icon: {
      name: 'star',
      backgroundColor: 'gold',
    },
    targetScreen: routes.FAVORITELEAPS,
  },
  {
    title: 'My Messages',
    icon: {
      name: 'email',
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGES,
  },
];

function AccountScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  // console.log('Account user', authContext.user);
  useEffect(() => {
    (async () => {
      authContext.setUser(await cache.get('user', 5));
    })();
  }, [authContext.setUser, cache]);
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          showIcon={true}
          title={authContext?.user?.value.username || 'No username'}
          subTitle={authContext?.user?.value.email || 'No email'}
          // image={require('../assets/thomas.jpg')}
          IconComponent={<Icon name="account" backgroundColor={colors.third} />}
          onPress={() => navigation.navigate(routes.SETTINGS)}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              showIcon={true}
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              // onPress={navigation.navigate(routes.MESSAGES)}
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        showIcon={true}
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={async () => {
          const deletedUser = await cache.deleteUser('user');
          console.log('deleteduser', deletedUser);
          await logoutApi.logout();
          authContext.setUser(deletedUser);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
