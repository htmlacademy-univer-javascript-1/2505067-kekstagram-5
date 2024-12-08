import {renderMiniPictuers} from './show-pictures.js';
import {showBigPicture} from './big-pictures.js';
const container = document.querySelector('.pictures');
const renderGallery = (pictures) => {
  container.addEventListener('click', (evt) => {
    const miniPicture = evt.target.closest('[data-picture-id]');
    if (!miniPicture) {
      return;
    }
    evt.preventDefault();
    const picture = pictures.find((item) => item.id === +miniPicture.dataset.pictureId);
    showBigPicture(picture);
  });
  renderMiniPictuers(pictures, container);
};
export {renderGallery};
