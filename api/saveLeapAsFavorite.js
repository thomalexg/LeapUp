import client from './client';

const endpoint = '/saveleapasfavorite';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const saveLeapAsFavorite = (user_id, leap_id) => {
  return client.post(endpoint, {
    user_id,
    leap_id,
  });
};

export default { saveLeapAsFavorite };
