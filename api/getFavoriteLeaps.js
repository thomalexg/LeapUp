import client from './client';

const endpoint = '/getfavoriteleaps';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getFavoriteLeaps = (user_id, lastLoadedLeapId) => {
  return client.post(endpoint, {
    user_id,
    lastLoadedLeapId,
  });
};

export default { getFavoriteLeaps };
