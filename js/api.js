const MAIN_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
const ErrorMessage = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const loadingData = (currentRoute, errorText, method = Method.GET, body = null) =>
  fetch(`${MAIN_URL}${currentRoute}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
    });
const fetchData = () => loadingData(Route.GET_DATA, ErrorMessage.GET_DATA);
const postData = (body) => loadingData(Route.SEND_DATA, ErrorMessage.SEND_DATA, Method.POST, body);
export { fetchData as getData, postData as sendData };
