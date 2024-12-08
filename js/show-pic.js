import { generatePhotos } from './data.js';

const showPicturesTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
const showAllPictures = generatePhotos();

const similarListFragment = document.createDocumentFragment();

const createPictures = ({url, description, likes, comments}) => {
  const showPictures = showPicturesTemplate.cloneNode(true);
  showPictures.querySelector('.picture__img').src = url;
  showPictures.querySelector('.picture__img').alt = description;
  showPictures.querySelector('.picture__likes').textContent = likes;
  showPictures.querySelector('.picture__comments').textContent = comments.length;
  return showPictures;
};
showAllPictures.forEach(({url, description, likes, comments}) => {
  similarListFragment.append(createPictures({url, description, likes, comments}));
});

document.querySelector('.pictures').append(similarListFragment);

