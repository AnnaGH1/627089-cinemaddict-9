import {films, filters} from './model/data';
import PageController from './controllers/page';
import StatisticsController from './controllers/statistics';

const mainContainer = document.querySelector(`.main`);
const statisticsController = new StatisticsController(mainContainer);
const pageController = new PageController(mainContainer, films, filters);

pageController.init();
statisticsController.init();
