import { makeAllPictures } from './show-minipic.js';
import { getData } from './api.js';
import { showAlert, getArrayRandomPrototype, debounce } from './util.js';

const REQUEST_DURATION_MS = 500;
const NUMBER_RANDOM_PICS = 10;

const FILTER_CLASSES = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  POPULAR: 'filter-discussed',
};

const ACTIVE_FILTER_BUTTON_CLASS = 'img-filters__button--active';

const filterButtons = document.querySelectorAll('.img-filters__button');

let currentFilter = FILTER_CLASSES.DEFAULT;
let currentActiveButton = document.getElementById(FILTER_CLASSES.DEFAULT);

const filterPictures = (pictures) => {
  switch (currentFilter) {
    case FILTER_CLASSES.POPULAR:
      return [...pictures].sort((a, b) => b.comments.length - a.comments.length);
    case FILTER_CLASSES.RANDOM:
      return getArrayRandomPrototype(pictures, NUMBER_RANDOM_PICS);
    case FILTER_CLASSES.DEFAULT:
    default:
      return pictures;
  }
};

const updatePictureRendering = (allPictures) => {
  const filteredPictures = filterPictures(allPictures);
  document.querySelectorAll('.picture').forEach((picture) => picture.remove());
  makeAllPictures(filteredPictures);
};

const createFilterButtonClickHandler = (callback) => (event) => {
  currentActiveButton.classList.remove(ACTIVE_FILTER_BUTTON_CLASS);
  currentFilter = event.target.id;
  currentActiveButton = event.target;
  currentActiveButton.classList.add(ACTIVE_FILTER_BUTTON_CLASS);
  callback();
};

getData()
  .then((allPictures) => {
    makeAllPictures(allPictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');

    const onFilterButtonClick = createFilterButtonClickHandler(debounce(() => updatePictureRendering(allPictures), REQUEST_DURATION_MS));
    filterButtons.forEach((button) => button.addEventListener('click', onFilterButtonClick));
  })
  .catch((error) => showAlert(error.message));
