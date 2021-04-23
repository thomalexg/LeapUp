import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import changePasswordApi from '../api/changePassword';
import logoutApi from '../api/logout';
import AuthContext from '../auth/context';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import cache from '../utility/cache';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  password1: Yup.string().required().min(4).max(64).label('Password'),
  password2: Yup.string()
    .required()
    .oneOf([Yup.ref('password1'), null], 'Passwords must match')
    .label('Password'),
});

function LeapAddScreen() {
  const authContext = useContext(AuthContext);

  const user = authContext.user;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (leap, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await changePasswordApi.changePassword(
      leap.password1,
      user.value.id,
      (progress) => setProgress(progress),
    );

    if (!result) {
      setUploadVisible(false);
      return alert('Could not change password :(');
    }
    const deletedUser = await cache.deleteUser('user');
    await logoutApi.logout();
    authContext.setUser(deletedUser);
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
          password1: '',
          password2: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          maxLength={255}
          name="password1"
          placeholder="New Password"
          icon="lock"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <FormField
          maxLength={255}
          name="password2"
          placeholder="Repeat New Password"
          icon="lock"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
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
