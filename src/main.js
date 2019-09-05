import {films, filmsTopRated, filmsMostCommented, filters, sortList, userTitles, FilmsCount, PromoCategory} from "./components/data";
import {getSearchTemplate} from "./components/search";
import {getUserTemplate, defineUser} from "./components/users";
import {getMainNavTemplate, getSortTemplate} from "./components/menu";
import {getFilmsListTemplate, getFilmsItemsTemplate, getFeaturedFilmsTemplate} from "./components/films";

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

// Controls
renderComponent(headerContainer, getSearchTemplate());
renderComponent(headerContainer, getUserTemplate(defineUser(FilmsCount.BY_USER, userTitles)));
renderComponent(mainContainer, getMainNavTemplate(filters));
renderComponent(mainContainer, getSortTemplate(sortList));

// Content
renderComponent(mainContainer, getFilmsListTemplate());
const filmsContainerOuter = mainContainer.querySelector(`.films`);
const filmsContainer = mainContainer.querySelector(`.films-list`);
const filmsContainerInner = mainContainer.querySelector(`.films-list__container`);
let filmPageStart = 0;
let filmPageEnd = FilmsCount.PER_PAGE;
renderComponent(filmsContainerInner, getFilmsItemsTemplate(films.slice(filmPageStart, filmPageEnd)));
renderComponent(filmsContainerOuter, getFeaturedFilmsTemplate(filmsTopRated, PromoCategory.RATING));
renderComponent(filmsContainerOuter, getFeaturedFilmsTemplate(filmsMostCommented, PromoCategory.COMMENTS));

// Footer
const filmsAvailable = document.querySelector(`.footer__statistics`).querySelector(`p`);
filmsAvailable.textContent = `${FilmsCount.TOTAL} movies inside`;

// Load more films
const loadMore = document.querySelector(`.films-list__show-more`);
loadMore.addEventListener(`click`, () => {
  filmPageStart += FilmsCount.PER_PAGE;
  filmPageEnd += FilmsCount.PER_PAGE;

  if (filmPageEnd >= films.length) {
    filmsContainer.removeChild(loadMore);
  }
  renderComponent(filmsContainerInner, getFilmsItemsTemplate(films.slice(filmPageStart, filmPageEnd)));
});
