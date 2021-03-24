import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import registerApi from '../api/register';
import AuthContext from '../auth/context';
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';
import cache from '../utility/cache';

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(4).label('Username'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const [authNotification, setAuthNotification] = useState(false);

  // useEffect(() => {
  //   getSession();
  // }, []);

  // const getSession = async () => {
  //   const cachedSession = await cache.get('session', 5);
  //   const session =
  //     cachedSession !== null ? cachedSession : await sessionApi.getSession();
  //   if (!cachedSession) {
  //     cache.store('session', session.data);
  //   }

  // This works
  // const response = await sessionApi.getSession();
  // console.log(response.data);
  // cache.store('session', response.data);
  // const storedSession = await cache.get('session');
  // console.log('Cache:', storedSession);
  // };
  const handleSubmit = async (user) => {
    setAuthNotification(false);
    const result = await registerApi.register(user);
    console.log('result', result);
    if (!result) {
      return;
    } else if (result?.ok === false) {
      return setAuthNotification(true);
    }
    console.log('This should be the user:', result.data.user);
    console.log('session:', result.data.token);
    await cache.store('user', result.data.user);
    const getUser = await cache.get('user', 5);
    authContext.setUser(getUser);
  };
  return (
    <Screen style={styles.container}>
      {/* {authNotification && <AppText>User already exists!</AppText>} */}
      <Form
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="Invalid mail, username or password!"
          visible={authNotification}
        />
        <FormField
          autoCorrect={false}
          icon="account"
          name="username"
          placeholder="Username"
          textContentType="username"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
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
        <SubmitButton title="Register" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
