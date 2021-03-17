import client from './client';

const endpoint = '/register';

// const getSession = async () => {
//   const cachedSession = await cache.get('session', 5);
//   return cachedSession.value.token;
// };

export const register = async (user) => {
  return client.post(
    endpoint,
    {
      username: user.username,
      email: user.email,
      password: user.password,
      // sessionToken: await getSession(),
    },
    // {
    //   onUploadProgress: (progress) =>
    //     onUploadProgress(progress.loaded / progress.total),
    // },
  );
};

export default { register };
