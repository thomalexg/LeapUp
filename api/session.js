import client from './client';

const endpoint = '/session';
const getSession = () => client.get(endpoint);

export default { getSession };
