import { makeAllPictures } from './show-pic.js';
import { getData } from './api.js';
import { showingAlert } from './util.js';

async function loadPictures() {
  try {
    const pictures = await getData();
    makeAllPictures(pictures);
  } catch (error) {
    showingAlert(error.message);
  }
}

loadPictures();
