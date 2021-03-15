import React from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import CategoryPickerItem from '../components/CategoryPickerItem';
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label('Title'),
  description: Yup.string().label('Description'),
  category: Yup.object().required().nullable().label('Category'),
});

const categories = [
  {
    backgroundColor: '#fc5c65',
    icon: 'guitar-acoustic',
    label: 'Music',
    value: 1,
  },
  {
    backgroundColor: '#fd9644',
    icon: 'language-javascript',
    label: 'Programming',
    value: 2,
  },
  {
    backgroundColor: '#fed330',
    icon: 'camera',
    label: 'Photography',
    value: 3,
  },
  {
    backgroundColor: '#26de81',
    icon: 'cards',
    label: 'Games',
    value: 4,
  },
  {
    backgroundColor: '#2bcbba',
    icon: 'shoe-heel',
    label: 'Clothing',
    value: 5,
  },
  {
    backgroundColor: '#45aaf2',
    icon: 'basketball',
    label: 'Sports',
    value: 6,
  },
  {
    backgroundColor: '#4b7bec',
    icon: 'video',
    label: 'Videography',
    value: 7,
  },
  {
    backgroundColor: '#a55eea',
    icon: 'book-open-variant',
    label: 'Books',
    value: 8,
  },
  {
    backgroundColor: '#a55eea',
    icon: 'format-paint',
    label: 'Design',
    value: 9,
  },
  {
    backgroundColor: '#778ca3',
    icon: 'application',
    label: 'Other',
    value: 10,
  },
];

function LeapAddScreen() {
  // const handleSubmit = async (leap) => {
  //   const result = await leapsApi.addLeap(leap);
  //   if (!result.ok) return alert('Could not upload leap!');
  //   alert('Listing uploaded!');
  // };
  const handleSubmit = async (leap, { resetForm }) => {
    try {
      const response = await fetch('http://192.168.0.80:3000/api/leaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: leap.title,
          category_id: leap.category.value,
          description: leap.description,
        }),
      });
    } catch (err) {
      console.log('error', error);
      return alert('Could not upload leap!');
    }
    resetForm();
    // console.log(response.status);
    // if (response.status !== 200) {
    //   return alert('Could not upload leap!');
    // }
    // alert('Listing uploaded!');
    // const createdLeap = await response.json();
  };
  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          title: '',
          description: '',
          category: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
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
