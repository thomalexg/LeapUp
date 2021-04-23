import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import deleteAccountApi from '../api/deleteAccount';
import logoutApi from '../api/logout';
import AuthContext from '../auth/context';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import AppText from '../components/Text';
import cache from '../utility/cache';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(4).max(64).label('Password'),
});

function LeapAddScreen() {
  const authContext = useContext(AuthContext);

  const user = authContext.user;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (leap) => {
    const result = await deleteAccountApi.deleteAccount(
      leap.password,
      user.value.id,
      user.value.username,
    );

    if (!result.ok) {
      return alert('Could not delete account :(');
    }
    const deletedUser = await cache.deleteUser('user');
    await logoutApi.logout();
    authContext.setUser(deletedUser);
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppText>Happy to see you go, please don't come back!!!</AppText>
      <Form
        initialValues={{
          password: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          maxLength={255}
          name="password"
          placeholder="Password"
          icon="lock"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />

        <SubmitButton title="delete account" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default LeapAddScreen;
