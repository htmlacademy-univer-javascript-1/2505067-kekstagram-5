import { isEscape } from './util.js';

const COMMENT_STEP = 5;
const modalPictureElement = document.querySelector('.big-picture');
const closeModalButton = modalPictureElement.querySelector('.big-picture__cancel');
const modalImageElement = modalPictureElement.querySelector('.big-picture__img img');
const modalLikesCount = modalPictureElement.querySelector('.likes-count');
const modalDescriptionElement = modalPictureElement.querySelector('.social__caption');
const modalCommentsContainer = modalPictureElement.querySelector('.social__comments');
const commentTemplateElement = modalCommentsContainer.querySelector('.social__comment');
const loadMoreCommentsButton = modalPictureElement.querySelector('.comments-loader');
const commentsCounterElement = modalPictureElement.querySelector('.social__comment-count');

let currentPhoto;
let currentCommentIndex = 0;

const makeEmptyComments = () => {
  modalCommentsContainer.innerHTML = '';
};

const remakeComment = (comment) => {
  const remadeComment = commentTemplateElement.cloneNode(true);
  const userAvatar = remadeComment.querySelector('.social__picture');
  userAvatar.src = comment.avatar;
  userAvatar.alt = comment.name;
  remadeComment.querySelector('.social__text').textContent = comment.message;
  return remadeComment;
};

const renderComments = () => {
  let currentIndex = 0;
  for (let i = currentCommentIndex; i < currentCommentIndex + COMMENT_STEP; i++) {
    if (i === currentPhoto.comments.length) {
      loadMoreCommentsButton.classList.add('hidden');
      currentIndex = i - 1;
      break;
    }
    currentIndex = i;
    modalCommentsContainer.appendChild(remakeComment(currentPhoto.comments[i]));
  }
  currentCommentIndex = currentIndex + 1;
  commentsCounterElement.innerHTML = `${currentCommentIndex} из <span class="comments-count">${currentPhoto.comments.length}</span> комментариев`;
};

const remakePhoto = () => {
  modalImageElement.src = currentPhoto.url;
  modalLikesCount.textContent = currentPhoto.likes;
  modalDescriptionElement.textContent = currentPhoto.description;

  makeEmptyComments();
  renderComments();
};

const listenKeydown = (evt) => {
  if (isEscape(evt)) {
    evt.preventDefault();
    closeBigPost();
  }
};

const onClosePostClick = () => closeBigPost();
const onCommentsLoaderButtonClick = () => renderComments();

const openBigPost = (currentPost) => {
  modalPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', listenKeydown);
  closeModalButton.addEventListener('click', onClosePostClick);
  loadMoreCommentsButton.addEventListener('click', onCommentsLoaderButtonClick);
  currentPhoto = currentPost;
  remakePhoto();
};

function closeBigPost() {
  modalPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  loadMoreCommentsButton.classList.remove('hidden');
  document.removeEventListener('keydown', listenKeydown);
  closeModalButton.removeEventListener('click', onClosePostClick);
  loadMoreCommentsButton.removeEventListener('click', onCommentsLoaderButtonClick);
  currentCommentIndex = 0;
}

export {openBigPost};
