import client from './client';

const endpoint = '/getfilteredleaps';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getfilteredleaps = (
  filterCategory,
  filterLocation,
  lastLoadedLeapId,
) => {
  return client.post(endpoint, {
    category_id: filterCategory,
    location_id: filterLocation,
    lastLoadedLeapId,
  });
};

export default { getfilteredleaps };
