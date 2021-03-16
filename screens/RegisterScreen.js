import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import registerApi from '../api/register';
import sessionApi from '../api/session';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import cache from '../utility/cache';

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(4).label('Username'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

function RegisterScreen() {
  const [authNotification, setAuthNotification] = useState(false);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    const cachedSession = await cache.get('session', 5);
    const session =
      cachedSession !== null ? cachedSession : await sessionApi.getSession();
    if (!cachedSession) {
      cache.store('session', session.data);
    }
    console.log('session:', session);
    console.log('cachedsession:', cachedSession);
    // This works
    // const response = await sessionApi.getSession();
    // console.log(response.data);
    // cache.store('session', response.data);
    // const storedSession = await cache.get('session');
    // console.log('Cache:', storedSession);
  };
  const handleSubmit = async (user) => {
    setAuthNotification(false);
    const result = registerApi.register(user);

    if (!result) {
      setAuthNotification(true);
    }
  };
  return (
    <Screen style={styles.container}>
      {authNotification && <TextInput>User already exists!</TextInput>}
      <Form
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        onSubmit={(user) => registerApi.register(user)}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="account"
          name="username"
          placeholder="Username"
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
