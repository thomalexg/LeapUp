import client from './client';

const endpoint = '/getfavoriteleaps';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getFavoriteLeaps = (user_id) => {
  return client.post(endpoint, {
    user_id,
  });
};

export default { getFavoriteLeaps };
