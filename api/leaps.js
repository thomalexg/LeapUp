import client from './client';

const endpoint = '/leaps';
const getLeaps = () => client.get(endpoint);

export const addLeap = (leap, user, onUploadProgress) => {
  return client.post(
    endpoint,
    {
      title: leap.title,
      location: leap.location.id,
      category_id: leap.category.id,
      description: leap.description,
      user_id: user.value.id,
      username: user.value.username,
      email: user.value.email,
    },
    {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    },
  );
};

export default { getLeaps, addLeap };
