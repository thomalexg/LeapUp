import client from './client';

const endpoint = '/myleaps';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getMyLeaps = (user_id, lastLoadedLeapId) => {
  return client.post(endpoint, {
    user_id,
    lastLoadedLeapId,
  });
};

export default { getMyLeaps };
