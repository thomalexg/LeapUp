import client from './client';

const endpoint = '/deletefavoriteleap';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const deleteFavoriteLeap = (item, user) => {
  return client.post(endpoint, {
    leap_id: item.id,
    user_id: user.id
  });
};

export default { deleteFavoriteLeap };
