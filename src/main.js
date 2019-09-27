import {Position, render} from './components/utils';
import {films, userType, filters} from './components/data';
import User from './components/user';
import Search from './components/search';
import PageController from './controllers/page';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const user = new User(userType);
const search = new Search();
const pageController = new PageController(mainContainer, films, filters);

render(headerContainer, user.getElement(), Position.BEFOREEND);
render(headerContainer, search.getElement(), Position.BEFOREEND);
pageController.init();


