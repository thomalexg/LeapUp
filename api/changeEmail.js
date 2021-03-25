import client from './client';

const endpoint = '/changeemail';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const changeEmail = (email, user_id) => {
  return client.post(endpoint, {
    email,
    user_id,
  });
};

export default { changeEmail };
