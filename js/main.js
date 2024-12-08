import './data.js';
import './util.js';

import { renderGallery } from './gallery.js';
import { generatePhotos } from './data.js';

renderGallery(generatePhotos());
