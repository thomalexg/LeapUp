import apiClient from './client';

// const createSession = async () => await sessionApi.getSession();

const logout = async () => apiClient.delete('/logout');

export default { logout };
