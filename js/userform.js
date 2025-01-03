import { checkForRepeatsInHashtags, isEscape } from './util.js';
import { addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter } from './effects.js';
import { sendData } from './api.js';

const MAX_TAG_COUNT = 140;
const HASHTAG_PATTERN = 5;
const hashtagPattern = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const errorMessageClass = 'upload-form__error-text';
let hashtagErrorMessage = '';

const imageUploadForm = document.querySelector('.img-upload__form');
const imageScaleValue = imageUploadForm.querySelector('.scale__control--value');
const imageUploadInput = imageUploadForm.querySelector('.img-upload__input');
const imageUploadOverlay = imageUploadForm.querySelector('.img-upload__overlay');
const uploadOverlayCloseButton = imageUploadOverlay.querySelector('.img-upload__cancel');
const submitUploadButton = imageUploadForm.querySelector('.img-upload__submit');
const hashtagsInputField = imageUploadForm.querySelector('.text__hashtags');
const descriptionInputField = imageUploadForm.querySelector('.text__description');
const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const successMessageCloseButton = successMessageTemplate.querySelector('.success__button');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
const errorMessageCloseButton = errorMessageTemplate.querySelector('.error__button');

const pristineValidator = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: errorMessageClass
}, true);

const makeHashtagValidation = (currentHashtag) => {
  hashtagErrorMessage = '';
  currentHashtag = currentHashtag.trim().toLowerCase();
  const allHashtags = currentHashtag.split(/\s+/);

  if(!currentHashtag) {
    return true;
  }

  for (const hashtag of allHashtags) {
    if (! hashtagPattern.test(hashtag)) {
      hashtagErrorMessage = 'Введён некорректный хэштег';
      return false;
    }
    if (allHashtags.length > HASHTAG_PATTERN) {
      hashtagErrorMessage = `Превышено максимально допустимое количество хэштегов: ${HASHTAG_PATTERN}`;
      return false;
    }
    if (checkForRepeatsInHashtags(allHashtags)) {
      hashtagErrorMessage = 'Хэштеги должны быть уникальными';
      return false;
    }
  }
  return true;
};

const onInputInForm = () => {
  if (pristineValidator.validate()) {
    submitUploadButton.disabled = false;
  } else {
    submitUploadButton.disabled = true;
  }
};

const makeDescrValidation = (value) => value.length <= MAX_TAG_COUNT;

const getMessageIfErrorInHashtag = () => hashtagErrorMessage;

pristineValidator.addValidator(hashtagsInputField, makeHashtagValidation, getMessageIfErrorInHashtag);
pristineValidator.addValidator(descriptionInputField, makeDescrValidation, `Максимальная длина комментария - ${MAX_TAG_COUNT} символов`);

const getKeydownHandler = (currentFunction) => (evt) => {
  if (isEscape(evt)) {
    evt.preventDefault();
    currentFunction();
  }
};

const handleInputKeydown = (event) => event.stopPropagation();
const handleCloseWindowKeydown = getKeydownHandler(hideEditingForm);
const handleCloseWindowClick = () => hideEditingForm();

function hideEditingForm() {
  imageUploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  uploadOverlayCloseButton.removeEventListener('click', handleCloseWindowClick);
  document.removeEventListener('keydown', handleCloseWindowKeydown);
  hashtagsInputField.removeEventListener('keydown', handleInputKeydown);
  descriptionInputField.removeEventListener('keydown', handleInputKeydown);
  hashtagsInputField.removeEventListener('input', onInputInForm);
  descriptionInputField.removeEventListener('input', onInputInForm);
  removeEventListenerFromScaleElemets();
  removeFilter();

  imageScaleValue.value = '100%';
  hashtagsInputField.value = '';
  descriptionInputField.value = '';
  imageUploadInput.value = '';

  const errorContainers = document.querySelectorAll(`.${errorMessageClass}`);
  if (errorContainers) {
    errorContainers.forEach((container) => container.setAttribute('style', 'display: none;'));
  }
}

const showEditingForm = () => {
  imageUploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  uploadOverlayCloseButton.addEventListener('click', handleCloseWindowClick);
  document.addEventListener('keydown', handleCloseWindowKeydown);
  hashtagsInputField.addEventListener('keydown', handleInputKeydown);
  descriptionInputField.addEventListener('keydown', handleInputKeydown);
  hashtagsInputField.addEventListener('input', onInputInForm);
  descriptionInputField.addEventListener('input', onInputInForm);

  addEventListenerToScaleElemets();
  addFilter();
};

const onLoadingPhotoElementChange = () => showEditingForm();

imageUploadInput.addEventListener('change', onLoadingPhotoElementChange);

const blockSubmitButton = () => {
  submitUploadButton.disabled = true;
  submitUploadButton.textContent = 'Публикация...';
};

const unlockSubmitButton = () => {
  submitUploadButton.disabled = false;
  submitUploadButton.textContent = 'Опубликовать';
};

const closingFormClickHandler = (className, currentFunction) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    currentFunction();
  }
};

const handleOutsideSuccessFormClick = closingFormClickHandler('success__inner', closeSuccessAlert);
const handleOutsideErrorFormClick = closingFormClickHandler('error__inner', closeErrorAlert);
const handleErrorCloseButtonClick = () => closeErrorAlert();
const handleSuccessCloseButtonClick = () => closeSuccessAlert();
const handleSuccessFormKeydown = getKeydownHandler(closeSuccessAlert);
const handleErrorFormKeydown = getKeydownHandler(closeErrorAlert);

function closeSuccessAlert() {
  document.removeEventListener('click', handleOutsideSuccessFormClick);
  document.removeEventListener('keydown', handleSuccessFormKeydown);
  document.body.removeChild(successMessageTemplate);
  successMessageCloseButton.removeEventListener('click', handleSuccessCloseButtonClick);
}

function closeErrorAlert() {
  imageUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', handleCloseWindowKeydown);
  document.body.removeChild(errorMessageTemplate);
  errorMessageCloseButton.removeEventListener('click', handleErrorCloseButtonClick);
  document.removeEventListener('click', handleOutsideErrorFormClick);
  document.removeEventListener('keydown', handleErrorFormKeydown);
}

const openSuccessAlert = () => {
  successMessageCloseButton.addEventListener('click', handleSuccessCloseButtonClick);
  document.body.appendChild(successMessageTemplate);
  document.addEventListener('click', handleOutsideSuccessFormClick);
  document.addEventListener('keydown', handleSuccessFormKeydown);
};

const openErrorAlert = () => {
  imageUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', handleCloseWindowKeydown);
  errorMessageCloseButton.addEventListener('click', handleErrorCloseButtonClick);
  document.body.appendChild(errorMessageTemplate);
  document.addEventListener('click', handleOutsideErrorFormClick);
  document.addEventListener('keydown', handleErrorFormKeydown);
};

imageUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  blockSubmitButton();

  sendData(new FormData(evt.target))
    .then(() => {
      hideEditingForm();
      openSuccessAlert();
    })
    .catch(openErrorAlert)
    .finally(unlockSubmitButton);
});

