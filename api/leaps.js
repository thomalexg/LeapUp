import client from './client';

const endpoint = '/leaps';
const getLeaps = () => client.get(endpoint);

export const addLeap = (leap) => {
  const data = new FormData();
  // data.append('user_id', leap.user_id);
  data.append('title', leap.title);
  data.append('categoryId', leap.category.value);
  data.append('description', leap.description);

  // listing.images.forEach((image, index) =>
  //   data.append("images", {
  //     name: "image" + index,
  //     type: "image/jpeg",
  //     uri: image,
  //   })
  // );

  // if (listing.location)
  //   data.append("location", JSON.stringify(listing.location));

  return client.post(endpoint, data);
};

export default { getLeaps, addLeap };
