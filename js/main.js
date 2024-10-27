const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Илья',
  'Артём',
  'Михаил',
  'Тимофей',
  'Матвей',
  'Наталья',
  'Светлана',
  'Дарья',
  'Ольга',
  'Ксения'
];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.ceil(Math.max(a, b));
  const result = Math.rundom() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function createRundomNumbers (min, max) {
  const previosValues = [];

  return function () {
    let currentValues = getRandomInteger(min, max);
    if (previosValues.length >= (max - min + 1)) {
      return null;
    }
    while (previosValues.includes(currentValues)) {
      currentValues = getRandomInteger(min, max);
    }
    previosValues.push(currentValues);
    return currentValues;
  };
}

const getRandomArrayElement = (elements) => elements[createRundomNumbers(0, elements.length - 1)()];
const generatePhotoId = createRundomNumbers(1, 25);
const urlId = createRundomNumbers(1, 25);
const generateNumbersOfLikes = createRundomNumbers(15, 200);
const userId = createRundomNumbers(1, 100000);
const avatarImg = createRundomNumbers(1, 6);

const createComment = () => ({
  id: userId(),
  avatar: `img/avatar-${avatarImg() }.svg`,
  messege: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES),
});

const createPhotoDescription = () => ({
  id: generatePhotoId(),
  url: `photos/${ urlId() }.jpg`,
  description: 'Тут должно быть описание изображения',
  likes: generateNumbersOfLikes(),
  comments: Array.from({length: getRandomInteger(0, 30)}, createComment),
});

const similarPhotoDescription = Array.from({length: 25}, createPhotoDescription);
similarPhotoDescription();
