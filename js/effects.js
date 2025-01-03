const MIN_ZOOM_LEVEL = 25;
const MAX_ZOOM_LEVEL = 100;
const ZOOM_INCREMENT = 25;
const FULL_PERCENTAGE = 100;

const buttonZoomOut = document.querySelector('.scale__control--smaller');
const buttonZoomIn = document.querySelector('.scale__control--bigger');
const scaleValueControl = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsListContainer = document.querySelector('.effects__list');
const effectSliderContainer = document.querySelector('.img-upload__effect-level');
const effectValueDisplay = effectSliderContainer.querySelector('.effect-level__slider');
const currentEffect = effectSliderContainer.querySelector('.effect-level__value');

let filterType = 'none';

const zoomOutImage = () => {
  let currentScaleValue = parseInt(scaleValueControl.value, 10);
  if (currentScaleValue > MIN_ZOOM_LEVEL) {
    currentScaleValue -= ZOOM_INCREMENT;
    scaleValueControl.value = `${currentScaleValue.toString()}%`;
    previewImage.style.transform = `scale(${currentScaleValue / FULL_PERCENTAGE})`;
  }
};

const zoomInImage = () => {
  let currentScaleValue = parseInt(scaleValueControl.value, 10);
  if (currentScaleValue < MAX_ZOOM_LEVEL) {
    currentScaleValue += ZOOM_INCREMENT;
    scaleValueControl.value = `${currentScaleValue.toString()}%`;
    previewImage.style.transform = `scale(${currentScaleValue / FULL_PERCENTAGE})`;
  }
};

const addEventListenerToScaleElemets = () => {
  buttonZoomOut.addEventListener('click', zoomOutImage);
  buttonZoomIn.addEventListener('click', zoomInImage);
};

const removeEventListenerFromScaleElemets = () => {
  buttonZoomOut.removeEventListener('click', zoomOutImage);
  buttonZoomIn.removeEventListener('click', zoomInImage);
};

const getEffectParameters = (min, max, step, funcTo, funcFrom) => ({
  range: {
    min: min,
    max: max,
  },
  start: max,
  step: step,
  connect: 'lower',
  format: {
    to: funcTo,
    from: funcFrom
  }
});

const changeFilter = (currentFilterID) => {
  let currentFilterClass;
  let effectParameters;
  switch (currentFilterID) {
    case 'effect-none':
      effectSliderContainer.setAttribute('hidden', true);
      currentFilterClass = 'effects__preview--none';
      filterType = 'none';
      effectParameters = getEffectParameters(0, 1, 0.1, (value) => value, (value) => parseFloat(value));
      break;

    case 'effect-chrome':
      effectSliderContainer.removeAttribute('hidden');
      currentFilterClass = 'effects__preview--chrome';
      filterType = 'grayscale';
      effectParameters = getEffectParameters(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;

    case 'effect-sepia':
      effectSliderContainer.removeAttribute('hidden');
      currentFilterClass = 'effects__preview--sepia';
      filterType = 'sepia';
      effectParameters = getEffectParameters(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;

    case 'effect-marvin':
      effectSliderContainer.removeAttribute('hidden');
      currentFilterClass = 'effects__preview--marvin';
      filterType = 'invert';
      effectParameters = getEffectParameters(0, 100, 1, (value) => `${value}%`, (value) => parseFloat(value));
      break;

    case 'effect-phobos':
      effectSliderContainer.removeAttribute('hidden');
      currentFilterClass = 'effects__preview--phobos';
      filterType = 'blur';
      effectParameters = getEffectParameters(0, 3, 0.1, (value) => `${value.toFixed(1)}px`, (value) => parseFloat(value));
      break;

    case 'effect-heat':
      effectSliderContainer.removeAttribute('hidden');
      currentFilterClass = 'effects__preview--heat';
      filterType = 'brightness';
      effectParameters = getEffectParameters(1, 3, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;
  }
  previewImage.className = '';
  previewImage.classList.add(currentFilterClass);
  effectValueDisplay.noUiSlider.updateOptions(effectParameters);
};

const onFilterChange = (evt) => {
  if (evt.target.closest('.effects__item')) {
    changeFilter(evt.target.id);
  }
};

const addFilter = () => {
  currentEffect.value = 1;
  filterType = 'none';
  noUiSlider.create(effectValueDisplay, getEffectParameters(0, 1, 0.1, (value) => value, (value) => parseFloat(value)));
  effectSliderContainer.setAttribute('hidden', true);
  effectsListContainer.addEventListener('change', onFilterChange);

  effectValueDisplay.noUiSlider.on('update', () => {
    currentEffect.value = parseFloat(effectValueDisplay.noUiSlider.get());
    previewImage.style.filter = (filterType !== 'none') ? `${filterType}(${effectValueDisplay.noUiSlider.get()})` : '';
  });
};

const removeFilter = () => {
  effectsListContainer.removeEventListener('change', onFilterChange);
  previewImage.className = '';
  previewImage.style.transform = 'scale(1)';
  document.getElementById('effect-none').checked = true;
  effectValueDisplay.noUiSlider.destroy();
};

export {addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter };
