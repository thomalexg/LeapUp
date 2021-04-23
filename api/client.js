import { create } from 'apisauce';
// import settings from '../config/settings';

const apiClient = create({
  // baseURL: settings.apiUrl,
  baseURL: 'https://leapup-api.herokuapp.com/api',
});

export default apiClient;
