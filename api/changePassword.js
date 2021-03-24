import client from './client';

const endpoint = '/changepassword';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const changePassword = (password, user_id) => {
  return client.post(endpoint, {
    user_id,
    password,
  });
};

export default { changePassword };
