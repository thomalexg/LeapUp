import React, { useContext, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import loginApi from '../api/login';
import AuthContext from '../auth/context';
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from '../components/forms';
import cache from '../utility/cache';

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(4).label('Username'),
  password: Yup.string().required().min(4).label('Password'),
});

function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async (user) => {
    const result = await loginApi.login(user);
    // console.log('result', result);
    if (!result.ok) {
      return setLoginFailed(true);
    }
    console.log('Login done');
    await cache.store('user', result.data.user);
    const getUser = await cache.get('user', 43200);
    authContext.setUser(getUser);
    setLoginFailed(false);
  };

  return (
    // <Screen style={styles.screen}>
    <KeyboardAwareScrollView extraHeight={600}>
      <Image style={styles.logo} source={require('../assets/logo-new.png')} />

      <Form
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="Invalid username and/or password!"
          visible={loginFailed}
        />
        <FormField
          data-cy="enter-username"
          autoCorrect={false}
          icon="account"
          name="username"
          placeholder="Username"
          textContentType="username"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" />
      </Form>
    </KeyboardAwareScrollView>
    // </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
