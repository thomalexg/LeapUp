import apiClient from './client';

// const createSession = async () => await sessionApi.getSession();

const login = async ({ username, password }) => {
  return await apiClient.post('/login', {
    username,
    password,
    // sessionToken: await createSession(),
  });
};

export default { login };
