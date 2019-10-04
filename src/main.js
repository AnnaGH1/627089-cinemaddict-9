import {films} from './model/data';
import PageController from './controllers/page';

const mainContainer = document.querySelector(`.main`);
const pageController = new PageController(mainContainer, films);

pageController.init();
