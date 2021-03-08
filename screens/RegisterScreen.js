import React from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().min(4).label('First Name'),
  lastName: Yup.string().required().min(4).label('Last Name'),
  username: Yup.string().required().min(4).label('Username'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

function RegisterScreen() {
  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="account"
          name="firstName"
          placeholder="First Name"
        />
        <FormField
          autoCorrect={false}
          icon="account"
          name="lastName"
          placeholder="Last Name"
        />
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
