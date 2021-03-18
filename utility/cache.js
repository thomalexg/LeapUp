import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 5;

const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

const isExpired = (item, expiryInMinutes = 5) => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);

  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const get = async (key, expiryInMinutes) => {
  try {
    // console.log('prefix', prefix);
    // console.log('key', key);
    const value = await AsyncStorage.getItem(prefix + key);
    // console.log('value', value);
    const item = JSON.parse(value);
    // console.log('item', item);

    if (!item) return null;

    if (isExpired(item, expiryInMinutes)) {
      await AsyncStorage.removeItem(prefix + key);
    }
    return item;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (key) => {
  try {
    const noUser = await AsyncStorage.removeItem(prefix + key);
    return noUser;
  } catch (error) {
    console.log(error);
  }
};

export default { store, get, deleteUser };
