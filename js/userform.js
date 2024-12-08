import { isEscapeKey } from './util.js';
import { resetScale } from './scale.js';
import { init, reset } from './effects.js';

const MAX_HASHTAG_COUNT = 5;

const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;

const ErrorText = {
  INVALIS_COUNT: `Максимум ${MAX_HASHTAG_COUNT} хэштегов`,
  NOT_UNIQUE: 'Хэштеги должны быть уникальными',
  INVALIDE_PATTERN: 'Неправильный хэштег'
};

const form = document.querySelector('.img-upload__form');
const overlay = form.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const hashtagField = form.querySelector('.text__hashtags');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const showModal = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetScale();
  reset();
};

const normalizeTags = (tagString) => tagString.trim().split(' ').filter((tag) => Boolean(tag.length));
const isTextFieldFocused = () => document.activeElement === hashtagField || document.activeElement === form.querySelector('.text__description');
const hasValidCount = (value) => normalizeTags(value).length <= MAX_HASHTAG_COUNT;
const hasValidTags = (value) => normalizeTags(value).every((tag) => VALID_SYMBOLS.test(tag));
const hasUnidueTags = (value) => {
  const lowerCaseTags = normalizeTags(value).map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

function onDocumentKeydown(evt) {
  if (isEscapeKey && !isTextFieldFocused()) {
    evt.preventDefault();
    hideModal();
  }
}

const onCancelButtonClick = () => hideModal();

const onFileInputChange = () => showModal();
pristine.addValidator(
  hashtagField,
  hasValidCount,
  ErrorText.INVALIS_COUNT,
  3,
  true
);

pristine.addValidator(
  hashtagField,
  hasValidTags,
  ErrorText.INVALIDE_PATTERN,
  2,
  true
);

pristine.addValidator(
  hashtagField,
  hasUnidueTags,
  ErrorText.NOT_UNIQUE,
  1,
  true
);

form.querySelector('.img-upload__input').addEventListener('change', onFileInputChange);
form.querySelector('.img-upload__cancel').addEventListener('click', onCancelButtonClick);

init();
