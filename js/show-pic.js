const showPicturesTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const container = document.querySelector('.pictures');

const createPictures = ({url, description, likes, comments, id}) => {
  const showPictures = showPicturesTemplate.cloneNode(true);
  showPictures.querySelector('.picture__img').src = url;
  showPictures.querySelector('.picture__img').alt = description;
  showPictures.querySelector('.picture__likes').textContent = likes;
  showPictures.querySelector('.picture__comments').textContent = comments.length;
  showPictures.dataset.pictureId = id;
  return showPictures;
};

const renderMiniPictuers = (pictures) => {
  const similarListFragment = document.createDocumentFragment();
  pictures.forEach((picture) => {
    similarListFragment.append(createPictures(picture));
  });
  container.append(similarListFragment);
};

export { renderMiniPictuers };

