import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import categoriesApi from '../api/categories';
import leapsApi from '../api/leaps';
import AuthContext from '../auth/context';
import LeapsStateContext from '../auth/leapsStateContext';
import LocationsContext from '../auth/locationContext';
import CategoryPickerItem from '../components/CategoryPickerItem';
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton
} from '../components/forms';
import Screen from '../components/Screen';
import SearchbarDropdown from '../components/SearchbarDropdown';
import UploadScreen from './UploadScreen';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label('Title'),
  location: Yup.object().required().label('Location'),
  description: Yup.string().required().label('Description'),
  category: Yup.object().required().nullable().label('Category'),
});

function LeapAddScreen() {
  const authContext = useContext(AuthContext);
  const locationsContext = useContext(LocationsContext);
  const locations = locationsContext.locations;
  const user = authContext.user;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [deleteCity, setDeleteCity] = useState(false);
  const leapsStateContext = useContext(LeapsStateContext);
  const [cityReset, setCityReset] = useState(false);
  useEffect(() => {
    const categorieFunc = async () => {
      const getCategories = await categoriesApi.getCategories();
      setCategories(getCategories.data);
    };
    categorieFunc();
  }, []);

  const handleSubmit = async (leap, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await leapsApi.addLeap(leap, user, (progress) =>
      setProgress(progress),
    );
    setDeleteCity(true);

    if (!result) {
      setUploadVisible(false);
      return alert('Could not add new leap :(');
    }
    leapsStateContext.setIsLeapsStateStale(true);
    setCityReset(true);
    resetForm();
  };

  return (
    <Screen style={styles.container}>
      <View>
        <KeyboardAwareScrollView extraHeight={600} nestedScrollEnabled={true}>
          <UploadScreen
            onDone={() => setUploadVisible(false)}
            progress={progress}
            visible={uploadVisible}
          />
          <Form
            initialValues={{
              title: '',
              location: '',
              description: '',
              category: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField maxLength={255} name="title" placeholder="Title" />
            <SearchbarDropdown
              name="location"
              numberOfColumns={1}
              items={locations}
              placeholder="Search for your location"
              cityReset={cityReset}
              setCityReset={setCityReset}
            />
            <Picker
              items={categories}
              name="category"
              numberOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder="Category"
              width="50%"
            />
            <FormField
              maxLength={1000}
              multiline
              name="description"
              numberOfLines={3}
              placeholder="Description"
            />
            <SubmitButton title="Post" />
          </Form>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default LeapAddScreen;
