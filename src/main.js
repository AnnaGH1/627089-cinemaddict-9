import {films, filters, sortList, USER_TITLES, FILMS_COUNT_BY_USER} from "./components/data";
import {getSearchTemplate} from "./components/search";
import {getUserTemplate, defineUser} from "./components/users";
import {getMainNavTemplate, getSortTemplate} from "./components/menu";
import {getFilmsTemplate} from "./components/films";

/**
 * Renders component inside container
 * @param {Element} container
 * @param {string} component
 * @param {string} position for component
 * @return {Element}
 */
const renderComponent = (container, component, position = `beforeend`) => container.insertAdjacentHTML(position, component);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

renderComponent(headerContainer, getSearchTemplate());
renderComponent(headerContainer, getUserTemplate(defineUser(FILMS_COUNT_BY_USER, USER_TITLES)));
renderComponent(mainContainer, getMainNavTemplate(filters));
renderComponent(mainContainer, getSortTemplate(sortList));
renderComponent(mainContainer, getFilmsTemplate(films));
