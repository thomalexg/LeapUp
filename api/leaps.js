import client from './client';

const endpoint = '/leaps';
const getLeaps = () => client.get(endpoint);

export const addLeap = (leap, onUploadProgress) => {
  return client.post(
    endpoint,
    {
      title: leap.title,
      category_id: leap.category.value,
      description: leap.description,
    },
    {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    },
  );
};

export default { getLeaps, addLeap };
