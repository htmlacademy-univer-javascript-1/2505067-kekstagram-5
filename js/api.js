const API_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const ApiRoutes = {
  FETCH_DATA: '/data',
  SUBMIT_DATA: '/',
};

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorMessages = {
  FETCH_DATA_ERROR: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SUBMIT_DATA_ERROR: 'Не удалось отправить форму. Пожалуйста, исправьте некорректные значения и попробуйте снова',
};

//загрузка данных по указанному маршруту
const loadData = async (route, errorMessage, method = HttpMethods.GET, body = null) => {
  try {
    const response = await fetch(`${API_URL}${route}`, { method, body });
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return await response.json();
  } catch {
    throw new Error(errorMessage);
  }
};

const getData = () => loadData(ApiRoutes.FETCH_DATA, ErrorMessages.FETCH_DATA_ERROR);

const sendData = (body) => loadData(ApiRoutes.SUBMIT_DATA, ErrorMessages.SUBMIT_DATA_ERROR, HttpMethods.POST, body);

export { getData, sendData };
