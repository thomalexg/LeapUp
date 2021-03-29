import client from './client';

const endpoint = '/getleapsbyusername';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getLeapsByUsername = (username, lastLoadedLeapId) => {
  return client.post(endpoint, {
    username,
    lastLoadedLeapId,
  });
};

export default { getLeapsByUsername };
