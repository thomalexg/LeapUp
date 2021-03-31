import client from './client';

const endpoint = '/deleteaccount';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const deleteAccount = (password, user_id, username) => {
  return client.post(endpoint, {
    user_id,
    password,
    username,
  });
};

export default { deleteAccount };
