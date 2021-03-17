import apiClient from './client';
import sessionApi from './session';

const createSession = async () => await sessionApi.getSession();

const login = async ({ email, password }) => {
  apiClient.post('/login', {
    email,
    password,
    sessionToken: await createSession(),
  });
};

export default { login };
