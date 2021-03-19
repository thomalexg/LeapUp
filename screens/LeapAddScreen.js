import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import categoriesApi from '../api/categories';
import leapsApi from '../api/leaps';
import AuthContext from '../auth/context';
import CategoryPickerItem from '../components/CategoryPickerItem';
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label('Title'),
  description: Yup.string().label('Description'),
  category: Yup.object().required().nullable().label('Category'),
});

function LeapAddScreen() {
  const authContext = useContext(AuthContext);
  // console.log('ADDScreen user', authContext.user);
  const user = authContext.user;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  console.log('The categories', categories);
  useEffect(() => {
    const categorieFunc = async () => {
      const getCategories = await categoriesApi.getCategories();
      // console.log('The categories should be here:', getCategories.data);
      setCategories(getCategories.data);
    };
    categorieFunc();
  }, []);

  const handleSubmit = async (leap, { resetForm }) => {
    console.log('userAdd', user);
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
          title: '',
          description: '',
          category: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* {console.log('categories', categories)} */}
        <FormField maxLength={255} name="title" placeholder="Title" />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
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
