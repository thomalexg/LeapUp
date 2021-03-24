import React, { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AuthContext from '../auth/context';
import Icon from '../components/Icon';
import { ListItem, ListItemSeparator } from '../components/lists';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';
import cache from '../utility/cache';

const menuItems = [
  {
    title: 'Change Password',
    icon: {
      name: 'lock-alert',
      backgroundColor: colors.third,
    },
    targetScreen: routes.PASSWORD,
  },
  {
    title: 'Change Email',
    icon: {
      name: 'email',
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.EMAIL,
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
