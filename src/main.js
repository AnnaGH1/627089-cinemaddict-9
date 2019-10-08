import {Position, render, unrender} from './utils';
import LoadMessage from './components/loader/load-message';
import PageController from './controllers/page';
import API from './helper/api';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const loadMessage = new LoadMessage();
const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

render(mainContainer, loadMessage.getElement(), Position.BEFOREEND);
api
  .getFilms()
  .then((films) => {
    const pageController = new PageController(mainContainer, films);
    pageController.init();
    unrender(loadMessage.getElement());
    loadMessage.removeElement();
    footer.classList.remove(`visually-hidden`);
  });

export {api};
