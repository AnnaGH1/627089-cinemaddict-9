import {renderComponent} from './components/utils';
import {IMG_USER, films, userTitle, FilmsCount} from './components/data';
import {getSearchTemplate} from './components/search';
import {getUserTemplate, defineUser} from './components/users';
import PageController from './controllers/page';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

// Controls
renderComponent(headerContainer, getSearchTemplate());
renderComponent(headerContainer, getUserTemplate(defineUser(FilmsCount.BY_USER, userTitle, IMG_USER)));

const pageController = new PageController(mainContainer, films);
pageController.init();


