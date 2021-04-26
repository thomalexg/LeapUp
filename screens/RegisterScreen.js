import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import AuthContext from '../auth/context';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import cache from '../utility/cache';

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(4).max(20).label('Username'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
  password1: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .label('Password'),
});

function RegisterScreen() {
  const authContext = useContext(AuthContext);
  const [authNotification, setAuthNotification] = useState(false);

  const handleSubmit = async (user) => {
    setAuthNotification(false);
    const result = await registerApi.register(user);
    if (!result) {
      return;
    } else if (result?.ok === false) {
      return setAuthNotification(true);
    }
    await cache.store('user', result.data.user);
    const getUser = await cache.get('user', 5);
    authContext.setUser(getUser);
  };
  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView extraHeight={200}>
        <Form
          initialValues={{
            username: '',
            email: '',
            password: '',
            password1: '',
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
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password1"
            placeholder="Repeat Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Register" />
        </Form>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
