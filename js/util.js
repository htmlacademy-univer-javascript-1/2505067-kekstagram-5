const ALERT_DISPLAY_MS = 5000;


const isEscape = (evt) => evt.key === 'Escape';


function getRandomIntValue(min, max) {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));
  const randomValue = Math.random() * (upperBound - lowerBound + 1);
  return Math.floor(randomValue) + lowerBound;
}

const getArrayRandomPrototype = (currentArray, prototypeSize) => {
  if (currentArray.length <= prototypeSize) {
    return currentArray.slice();
  }
  const currentArrayCopyFile = currentArray.slice();
  const prototype = [];

  for (let i = 0; i < prototypeSize; i++) {
    const randomIntIndex = getRandomIntValue(0, currentArrayCopyFile.length - 1);
    prototype.push(currentArrayCopyFile[randomIntIndex]);
    currentArrayCopyFile.splice(randomIntIndex, 1);
  }
  return prototype;
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, timeoutDelay);
  };
};

const showAlert = (message) => {
  const alertMessage = document.createElement('div');
  alertMessage.style.zIndex = '100';
  alertMessage.style.position = 'absolute';
  alertMessage.style.left = '0';
  alertMessage.style.top = '0';
  alertMessage.style.right = '0';
  alertMessage.style.padding = '10px 3px';
  alertMessage.style.fontSize = '30px';
  alertMessage.style.textAlign = 'center';
  alertMessage.style.backgroundColor = 'red';
  alertMessage.textContent = message;
  document.body.append(alertMessage);
  setTimeout(() => {
    alertMessage.remove();
  }, ALERT_DISPLAY_MS);
};

const checkForRepeatsInHashtags = (arr) => {
  const elements = {};
  for (const element of arr) {
    if (elements[element]) {
      return true;
    }
    elements[element] = 1;
  }
  return false;
};

export {
  isEscape,
  checkForRepeatsInHashtags,
  showAlert,
  getRandomIntValue,
  getArrayRandomPrototype,
  debounce
};
