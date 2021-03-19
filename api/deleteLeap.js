import client from './client';

const endpoint = '/deleteleap';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const deleteLeap = (item) => {
  return client.post(endpoint, {
    leap_id: item.id,
  });
};

export default { deleteLeap };
