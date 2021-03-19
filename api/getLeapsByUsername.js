import client from './client';

const endpoint = '/getleapsbyusername';
// const getMyLeaps = (user_id) => client.any({ method: 'GET' url: endpoint, params: { id: user_id } })

export const getLeapsByUsername = (username) => {
  return client.post(endpoint, {
    username,
  });
};

export default { getLeapsByUsername };
