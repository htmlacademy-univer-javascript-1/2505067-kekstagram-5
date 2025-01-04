import { checkForRepeatsInHashtags, isEscape } from './util.js';
import { addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter } from './effects.js';
import { sendData } from './api.js';


const DEFAULT_IMAGE_PATH = 'img/upload-default-image.jpg';
const SUPPORTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_DESC_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;
const HASHTAG_VALIDATION_REGEX = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const ERROR_TEXT_CLASS = 'upload-form__error-text';

let hashtagErrorMessage = '';

const uploadForm = document.querySelector('.img-upload__form');
const imgPreview = uploadForm.querySelector('.img-upload__preview img');
const effectImagePreviews = document.querySelectorAll('.effects__preview');
const imgInput = uploadForm.querySelector('.img-upload__input');
const submitBtn = uploadForm.querySelector('.img-upload__submit');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descInput = uploadForm.querySelector('.text__description');
const successMsgTemplate = document.querySelector('#success').content.querySelector('.success');
const successMsgCloseBtn = successMsgTemplate.querySelector('.success__button');
const errorMsgTemplate = document.querySelector('#error').content.querySelector('.error');
const overlayContainer = uploadForm.querySelector('.img-upload__overlay');
const closeOverlayBtn = overlayContainer.querySelector('.img-upload__cancel');
const errorMsgCloseBtn = errorMsgTemplate.querySelector('.error__button');

const pristineOptions = {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: ERROR_TEXT_CLASS
};

const pristineValidator = new Pristine(uploadForm, pristineOptions, true);

const validateHashtags = (inputHashtags) => {
  hashtagErrorMessage = '';
  const formattedHashtags = inputHashtags.trim().toLowerCase();
  const hashtagList = formattedHashtags.split(/\s+/);

  if (!formattedHashtags) {
    return true;
  }

  if (hashtagList.length > MAX_HASHTAG_COUNT) {
    hashtagErrorMessage = `Упс, ошибка! Превышено максимальное количество хэштегов: ${MAX_HASHTAG_COUNT}`;
    return false;
  }

  for (const tag of hashtagList) {
    if (!HASHTAG_VALIDATION_REGEX.test(tag)) {
      hashtagErrorMessage = 'Упс, ошибка! Данные введены некорректно';
      return false;
    }
  }

  if (checkForRepeatsInHashtags(hashtagList)) {
    hashtagErrorMessage = 'Упс, ошибка! Хэштеги не должны повторяться';
    return false;
  }

  return true;
};

const handleInputChange = () => {
  submitBtn.disabled = !pristineValidator.validate();
};

const validateDescriptionLength = (value) => value.length <= MAX_DESC_LENGTH;

const getHashtagErrorMsg = () => hashtagErrorMessage;

pristineValidator.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMsg);
pristineValidator.addValidator(descInput, validateDescriptionLength, `Максимальная длина комментария - ${MAX_DESC_LENGTH} символов`);

const onOverlayCloseKeydown = (evt) => {
  if (isEscape(evt) && evt.target !== hashtagsInput && evt.target !== descInput) {
    closeEditingOverlay();
  }
};

const onCloseOverlayButtonClick = closeEditingOverlay;

function closeEditingOverlay() {
  overlayContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');

  imgInput.value = '';
  imgPreview.src = DEFAULT_IMAGE_PATH;

  effectImagePreviews.forEach((preview) => {
    preview.style.removeProperty('background-image');
  });

  removeFilter();
  removeEventListenerFromScaleElemets();

  closeOverlayBtn.removeEventListener('click', onCloseOverlayButtonClick);
  document.removeEventListener('keydown', onOverlayCloseKeydown);
  hashtagsInput.removeEventListener('input', handleInputChange);
  descInput.removeEventListener('input', handleInputChange);

  uploadForm.reset();
  pristineValidator.reset();
}

const openEditingOverlay = () => {
  const uploadedImage = imgInput.files[0];

  if (SUPPORTED_IMAGE_TYPES.some((type) => uploadedImage.name.toLowerCase().endsWith(type))) {
    const imageObjectURL = URL.createObjectURL(uploadedImage);
    imgPreview.src = imageObjectURL;

    effectImagePreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageObjectURL}')`;
    });
  }

  addFilter();
  addEventListenerToScaleElemets();

  closeOverlayBtn.addEventListener('click', onCloseOverlayButtonClick);
  document.addEventListener('keydown', onOverlayCloseKeydown);
  hashtagsInput.addEventListener('input', handleInputChange);
  descInput.addEventListener('input', handleInputChange);

  document.body.classList.add('modal-open');
  overlayContainer.classList.remove('hidden');
};

const onImageInputChange = openEditingOverlay;

imgInput.addEventListener('change', onImageInputChange);

const setSubmitButtonState = (isDisabled, text) => {
  submitBtn.disabled = isDisabled;
  submitBtn.textContent = text;
};

const disableSubmitButton = () => setSubmitButtonState(true, 'Публикация...');
const enableSubmitButton = () => setSubmitButtonState(false, 'Опубликовать');

const closeOverlayOnClickOutside = (className, actionFunction) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    actionFunction();
  }
};

const getKeydownHandlerForClose = (actionFunction) => (evt) => {
  if (isEscape(evt)) {
    evt.preventDefault();
    actionFunction();
  }
};

const onCloseSuccessAlertClick = closeOverlayOnClickOutside('success__inner', closeSuccessAlert);
const onCloseErrorAlertClick = closeOverlayOnClickOutside('error__inner', closeErrorAlert);
const onErrorAlertCloseButtonClick = closeErrorAlert;
const onSuccessAlertCloseButtonClick = closeSuccessAlert;
const onSuccessAlertKeydown = getKeydownHandlerForClose(closeSuccessAlert);
const onErrorAlertKeydown = getKeydownHandlerForClose(closeErrorAlert);

function closeSuccessAlert() {

  removeEventListeners(successMsgCloseBtn, onCloseSuccessAlertClick, onSuccessAlertKeydown);

  removeElementFromDOM(successMsgTemplate);
}

function closeErrorAlert() {
  overlayContainer.classList.remove('hidden');

  removeEventListeners(errorMsgCloseBtn, onCloseErrorAlertClick, onErrorAlertKeydown);

  removeElementFromDOM(errorMsgTemplate);

  document.addEventListener('keydown', onOverlayCloseKeydown);
}

function removeEventListeners(button, clickHandler, keydownHandler) {
  button.removeEventListener('click', clickHandler);
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keydownHandler);
}

function removeElementFromDOM(element) {
  if (element && element.parentNode) {
    document.body.removeChild(element);
  }
}

const showErrorAlert = () => {
  overlayContainer.classList.add('hidden');
  document.removeEventListener('keydown', onOverlayCloseKeydown);
  errorMsgCloseBtn.addEventListener('click', onErrorAlertCloseButtonClick);
  document.body.appendChild(errorMsgTemplate);
  document.addEventListener('click', onCloseErrorAlertClick);
  document.addEventListener('keydown', onErrorAlertKeydown);
};

const showSuccessAlert = () => {
  successMsgCloseBtn.addEventListener('click', onSuccessAlertCloseButtonClick);
  document.body.appendChild(successMsgTemplate);
  document.addEventListener('click', onCloseSuccessAlertClick);
  document.addEventListener('keydown', onSuccessAlertKeydown);
};

const handleSubmit = function(evt) {
  evt.preventDefault();
  disableSubmitButton();

  const formData = new FormData(evt.target);
  sendData(formData)
    .then(() => {
      closeEditingOverlay();
      showSuccessAlert();
    })
    .catch(showErrorAlert)
    .finally(enableSubmitButton);
};

uploadForm.addEventListener('submit', handleSubmit);

