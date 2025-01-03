import { checkForRepeatsInHashtags, isEscape } from './utils.js';
import { addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter } from './effects.js';
import { sendData } from './api.js';

const DEFAULT_PICTURE = 'img/upload-default-image.jpg';
const TYPES_OF_FILES = ['jpg', 'jpeg', 'png'];
const MAX_TAG_COUNT = 140;
const HASHTAG_PATTERN = 5;
const hashtagPattern = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const errorMessageClass = 'upload-form__error-text';
let hashtagErrorMessage = '';

const imageUploadForm = document.querySelector('.img-upload__form');
const imageScaleValue = imageUploadForm.querySelector('.img-upload__preview img');
const imageUploadInput = document.querySelectorAll('.effects__preview');
const loadImage = imageUploadForm.querySelector('.img-upload__input');
const uploadOverlay = imageUploadForm.querySelector('.img-upload__overlay');
const uploadOverlayCloseButton = uploadOverlay.querySelector('.img-upload__cancel');
const submitUploadButton = imageUploadForm.querySelector('.img-upload__submit');
const hashtagsInputField = imageUploadForm.querySelector('.text__hashtags');
const descriptionInputField = imageUploadForm.querySelector('.text__description');
const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const successMessageCloseButton = successMessageTemplate.querySelector('.success__button');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
const errorMessageCloseButton = errorMessageTemplate.querySelector('.error__button');

const pristine = new Pristine(imageUploadForm, {
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
    if (!hashtagPattern.test(hashtag)) {
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
  if (pristine.validate()) {
    submitUploadButton.disabled = false;
  } else {
    submitUploadButton.disabled = true;
  }
};

const makeDescrValidation = (value) => value.length <= MAX_TAG_COUNT;

const getMessageIfErrorInHashtag = () => hashtagErrorMessage;

pristine.addValidator(hashtagsInputField, makeHashtagValidation, getMessageIfErrorInHashtag);
pristine.addValidator(descriptionInputField, makeDescrValidation, `Максимальная длина комментария - ${ MAX_TAG_COUNT} символов`);

const onClosingWindowKeydown = (evt) => {
  if (isEscape(evt) && evt.target !== hashtagsInputField && evt.target !== descriptionInputField) {
    hideEditingForm();
  }
};

const onCloseWindowElementClick = () => hideEditingForm();

function hideEditingForm() {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  loadImage.value = '';
  imageScaleValue.src = DEFAULT_PICTURE;
  imageUploadInput.forEach((currentPreview) => {
    currentPreview.style.removeProperty('background-image');
  });
  removeFilter();
  removeEventListenerFromScaleElemets();

  uploadOverlayCloseButton.removeEventListener('click', onCloseWindowElementClick);
  document.removeEventListener('keydown', onClosingWindowKeydown);
  hashtagsInputField.removeEventListener('input', onInputInForm);
  descriptionInputField.removeEventListener('input', onInputInForm);

  imageUploadForm.reset();
  pristine.reset();
}

const showEditingForm = () => {
  const currentImage = loadImage.files[0];

  if (TYPES_OF_FILES.some((currentType) => currentImage.name.toLowerCase().endsWith(currentType))) {
    imageScaleValue.src = URL.createObjectURL(currentImage);
    imageUploadInput.forEach((currentPreview) => {
      currentPreview.style.backgroundImage = `url('${URL.createObjectURL(currentImage)}')`;
    });
  }

  addFilter();
  addEventListenerToScaleElemets();

  uploadOverlayCloseButton.addEventListener('click', onCloseWindowElementClick);
  document.addEventListener('keydown', onClosingWindowKeydown);
  hashtagsInputField.addEventListener('input', onInputInForm);
  descriptionInputField.addEventListener('input', onInputInForm);

  document.body.classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');
};

const onLoadingPhotoElementChange = () => showEditingForm();

loadImage.addEventListener('change', onLoadingPhotoElementChange);

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

const getKeydownHandler = (currentFunction) => (evt) => {
  if (isEscape(evt)) {
    evt.preventDefault();
    currentFunction();
  }
};

const onOutsideIfSuccessFormClick = closingFormClickHandler('success__inner', closeSuccessAlert);
const onOutsideIfErrorFormClick = closingFormClickHandler('error__inner', closeErrorAlert);
const onErrorCloseButtonClick = () => closeErrorAlert();
const onSuccessCloseButtonClick = () => closeSuccessAlert();
const onSuccessFormKeydown = getKeydownHandler(closeSuccessAlert);
const onErrorFormKeydown = getKeydownHandler(closeErrorAlert);

function closeSuccessAlert() {
  document.removeEventListener('click', onOutsideIfSuccessFormClick);
  document.removeEventListener('keydown', onSuccessFormKeydown);
  document.body.removeChild(successMessageTemplate);
  successMessageCloseButton.removeEventListener('click', onSuccessCloseButtonClick);
}

function closeErrorAlert() {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onClosingWindowKeydown);
  document.body.removeChild(errorMessageTemplate);
  errorMessageCloseButton.removeEventListener('click', onErrorCloseButtonClick);
  document.removeEventListener('click', onOutsideIfErrorFormClick);
  document.removeEventListener('keydown', onErrorFormKeydown);
}

const openSuccessAlert = () => {
  successMessageCloseButton.addEventListener('click', onSuccessCloseButtonClick);
  document.body.appendChild(successMessageTemplate);
  document.addEventListener('click', onOutsideIfSuccessFormClick);
  document.addEventListener('keydown', onSuccessFormKeydown);
};

const openErrorAlert = () => {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onClosingWindowKeydown);
  errorMessageCloseButton.addEventListener('click', onErrorCloseButtonClick);
  document.body.appendChild(errorMessageTemplate);
  document.addEventListener('click', onOutsideIfErrorFormClick);
  document.addEventListener('keydown', onErrorFormKeydown);
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

