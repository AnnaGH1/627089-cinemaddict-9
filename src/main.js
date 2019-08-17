import {getSearchTemplate} from "./components/search";
import {getUserTemplate, users} from "./components/users";
import {getMainNavTemplate, getSortTemplate, navList, sortList} from "./components/menu";
import {getFilmsTemplate, films} from "./components/films";
// import {getFilmDetails} from "./components/details";

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
renderComponent(headerContainer, getUserTemplate(users[0]));
renderComponent(mainContainer, getMainNavTemplate(navList));
renderComponent(mainContainer, getSortTemplate(sortList));
renderComponent(mainContainer, getFilmsTemplate(films));
// renderComponent(mainContainer, getFilmDetails(films[0]));
