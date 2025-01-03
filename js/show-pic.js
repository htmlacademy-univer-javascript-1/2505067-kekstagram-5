import { openBigPost } from './drawphotos.js';

const pictureElements = document.querySelector('.pictures');
const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

const getPictureClickWorker = (pictures) => (evt) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    const currentPicture = pictures.find((photo) => photo.url === pictureElement.querySelector('.picture__img').getAttribute('src'));
    openBigPost(currentPicture);
  }
};

const makeAllPictures = (allPictures) => {
  const fragmentPictures = document.createDocumentFragment();

  allPictures.forEach(({url, description, likes, comments}) => {
    const currentPicture = photoTemplate.cloneNode(true);
    const image = currentPicture.querySelector('.picture__img');
    image.src = url;
    image.alt = description;
    currentPicture.querySelector('.picture__comments').textContent = comments.length;
    currentPicture.querySelector('.picture__likes').textContent = likes;
    fragmentPictures.appendChild(currentPicture);
  });

  pictureElements.appendChild(fragmentPictures);
  pictureElements.addEventListener('click', getPictureClickWorker(allPictures));
};

export {makeAllPictures};
