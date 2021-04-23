import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const prefix = 'cache';

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
  const now = dayjs();
  const storedTime = dayjs(item.timestamp);

  return now.diff(storedTime, 'minute') > expiryInMinutes;
};

const get = async (key, expiryInMinutes) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

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
    console.log('user.got deleted');
    return noUser;
  } catch (error) {
    console.log(error);
  }
};

export default { store, get, deleteUser };
