import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import colors from '../config/colors';
import routes from '../navigation/routes';

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={3}
      style={styles.background}
      source={require('../assets/background.jpg')}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo-new.png')} />
        <Text style={styles.header}>LeapUp</Text>
        <Text style={styles.tagline}>Learn up your life!</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
        <Button
          title="Register"
          color="secondary"
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonsContainer: {
    padding: 20,
    width: '100%',
  },
  logo: {
    width: 300,
    height: 300,
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 50,
    fontWeight: '800',
    color: colors.primary,
  },
  tagline: {
    fontSize: 25,
    fontWeight: '600',
    paddingVertical: 20,
    color: colors.dark,
  },
});

export default WelcomeScreen;
