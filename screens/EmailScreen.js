import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import changeEmailApi from '../api/changeEmail';
import logoutApi from '../api/logout';
import AuthContext from '../auth/context';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import cache from '../utility/cache';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
});

function LeapAddScreen() {
  const authContext = useContext(AuthContext);
  const user = authContext.user;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (leap, { resetForm }) => {
    console.log('changedMail', leap);
    console.log('user', user);
    console.log('leap', leap);
    setProgress(0);
    setUploadVisible(true);
    const result = await changeEmailApi.changeEmail(
      leap.email,
      user.value.id,
      (progress) => setProgress(progress),
    );

    if (!result) {
      setUploadVisible(false);
      return alert('Could not change Email :(');
    }
    const deletedUser = await cache.deleteUser('user');
    authContext.setUser(deletedUser);
    await logoutApi.logout();
    setUploadVisible(false);
    resetForm();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <Form
        initialValues={{
          email: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />

        <SubmitButton title="save changes" />
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
