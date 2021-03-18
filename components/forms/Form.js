import { Formik } from 'formik';
import React, { useContext } from 'react';
import AuthContext from '../../auth/context';

function AppForm({ initialValues, onSubmit, validationSchema, children }) {
  const authContext = useContext(AuthContext);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
