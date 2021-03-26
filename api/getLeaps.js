import client from './client';

const endpoint = '/getfilteredleaps';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getfilteredleaps = (filterCategory, filterLocation) => {
  return client.post(endpoint, {
    category_id: filterCategory,
    location_id: filterLocation,
    // lastLoadedLeap_id
  });
};

export default { getfilteredleaps };
