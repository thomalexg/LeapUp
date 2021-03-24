import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import leapsApi from '../api/leaps';
import { Form, FormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
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
    console.log('leapAdd', leap);
    // console.log('userAdd', user);
    console.log('leap', leap);
    setProgress(0);
    setUploadVisible(true);
    const result = await leapsApi.addLeap(leap, user, (progress) =>
      setProgress(progress),
    );

    if (!result) {
      setUploadVisible(false);
      return alert('Could not add new leap :(');
    }
    resetForm();
    navigation.navigate('Leaps');
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
