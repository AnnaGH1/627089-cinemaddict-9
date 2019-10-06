import PageController from './controllers/page';
import API from './helper/api';

const mainContainer = document.querySelector(`.main`);
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
export const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

api
  .getFilms()
  .then((films) => {
    const pageController = new PageController(mainContainer, films);
    pageController.init();
  });
