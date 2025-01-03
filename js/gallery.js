import { makeAllPictures } from './drawMiniatures.js';
import {getData} from './api.js';
import { showingAlert, getArrayRandomPrototype, debounce } from './utils.js';

const TIMEOUT_DURATION_MS = 500;
const RANDOM_PICTURES_COUNT = 10;
const DEFAULT_FILTER_CLASS = 'filter-default';
const RANDOM_FILTER_CLASS = 'filter-random';
const ACTIVE_FILTER_BUTTON_CLASS = 'img-filters__button--active';
const POPULAR_FILTER_CLASS = 'filter-discussed';

const filterButtonsList = document.body.querySelectorAll('.img-filters__button');

let currentFilterId = DEFAULT_FILTER_CLASS;
let currentFilterElement = document.getElementById(DEFAULT_FILTER_CLASS);

const makePicturesFilter = (allPictures) => {
  let requiredPictures = [];
  switch (currentFilterId) {
    case DEFAULT_FILTER_CLASS:
      requiredPictures = allPictures;
      break;
    case POPULAR_FILTER_CLASS:
      requiredPictures = allPictures.slice().sort((first, second) => second.comments.length - first.comments.length);
      break;
    case RANDOM_FILTER_CLASS:
      requiredPictures = getArrayRandomPrototype(allPictures, RANDOM_PICTURES_COUNT);
      break;
  }
  return requiredPictures;
};

const remakeRenderingPictures = (allPictures) => {
  const remadePhotos = makePicturesFilter(allPictures);
  document.querySelectorAll('.picture').forEach((currentPicture) => currentPicture.remove());
  makeAllPictures(remadePhotos);
};

const getFilterButtonsClickWorker = (callback) => (evt) => {
  currentFilterId = evt.target.id;
  currentFilterElement.classList.remove(ACTIVE_FILTER_BUTTON_CLASS);
  currentFilterElement = evt.target;
  currentFilterElement.classList.add(ACTIVE_FILTER_BUTTON_CLASS);
  callback();
};

getData()
  .then((allPictures) => {
    makeAllPictures(allPictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    const onClickFilterButton = getFilterButtonsClickWorker(debounce(() => remakeRenderingPictures(allPictures), TIMEOUT_DURATION_MS));
    filterButtonsList.forEach((currentElement) => currentElement.addEventListener('click', onClickFilterButton));
  })
  .catch((error) => showingAlert(error.message));
