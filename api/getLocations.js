import client from './client';

const endpoint = '/locations';
const getLocations = () => client.get(endpoint);

export default { getLocations };