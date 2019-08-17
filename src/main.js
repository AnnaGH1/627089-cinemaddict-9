import {getSearchTemplate} from "./components/search";
import {getUserTemplate, user} from "./components/user";
import {getMainNavTemplate, getSortTemplate, navList, sortList} from "./components/menu";

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
renderComponent(headerContainer, getUserTemplate(user));
renderComponent(mainContainer, getMainNavTemplate(navList));
renderComponent(mainContainer, getSortTemplate(sortList));
