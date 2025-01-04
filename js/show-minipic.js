import { openBigPost } from './draw-photos.js';


const pictureElements = document.querySelector('.pictures');

const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

const onPictureClick = (pictures) => (evt) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    const currentPicture = pictures.find((photo) => photo.url === pictureElement.querySelector('.picture__img').getAttribute('src'));
    openBigPost(currentPicture);
  }
};


const createPictureElement = ({ url, description, likes, comments }) => {
  const pictureElement = photoTemplate.cloneNode(true);
  const image = pictureElement.querySelector('.picture__img');

  image.src = url;
  image.alt = description;

  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;

  return pictureElement;
};

const makeAllPictures = (allPictures) => {
  const fragmentPictures = document.createDocumentFragment();

  allPictures.forEach((picture) => {
    const currentPicture = createPictureElement(picture);
    fragmentPictures.appendChild(currentPicture);
  });

  pictureElements.appendChild(fragmentPictures);
  const onPictureClickHandler = onPictureClick(allPictures);
  pictureElements.addEventListener('click', onPictureClickHandler);
};

export { makeAllPictures };
