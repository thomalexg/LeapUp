import Constants from 'expo-constants';

const settings = {
  dev: {
    apiUrl: 'https://leapup-api.herokuapp.com/api',
  },
  staging: {
    apiUrl: 'https://leapup-api.herokuapp.com/api',
  },
  prod: {
    apiUrl: 'https://leapup-api.herokuapp.com/api',
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.mainifest.releaseChannel === 'staging') return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
