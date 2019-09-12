import {render, unrender} from "./components/utils";
import {IMG_USER, films, filmsTopRated, filmsMostCommented, filters, sortList, userTitle, FilmsCount, PromoCategory} from "./components/data";
import {getSearchTemplate} from "./components/search";
import {getUserTemplate, defineUser} from "./components/users";
import {getMainNavTemplate, getSortTemplate} from "./components/menu";
import {getFilmsCategoriesTemplate} from "./components/films";
import {Film} from "./components/film";
import {Popup} from "./components/popup";

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
renderComponent(headerContainer, getUserTemplate(defineUser(FilmsCount.BY_USER, userTitle, IMG_USER)));
renderComponent(mainContainer, getMainNavTemplate(filters));
renderComponent(mainContainer, getSortTemplate(sortList));

// Content
renderComponent(mainContainer, getFilmsCategoriesTemplate(PromoCategory));
const body = document.querySelector(`body`);
const loadMoreContainer = mainContainer.querySelector(`.films-list`);
const filmsContainer = mainContainer.querySelector(`.films-list__container`);

const filmsContainersFeatured = mainContainer.querySelectorAll(`.films-list--extra .films-list__container`);
const containerTopRated = filmsContainersFeatured[0];
const containerMostCommented = filmsContainersFeatured[1];

let filmPageStart = 0;
let filmPageEnd = FilmsCount.PER_PAGE;

const renderFilm = (item, container) => {
  const film = new Film(item);
  const popup = new Popup(item);

  // Closes popup on Esc keydown
  const onEscKeyDown = (e) => {
    if (e.key === `Escape` || e.key === `Esc`) {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // Open popup
  film.getElement()
    .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
    .forEach((el) => {
      el.addEventListener(`click`, () => {
        render(body, popup.getElement(), `beforeend`);
        document.addEventListener(`keydown`, onEscKeyDown);
      });
    });

  // Close popup
  popup.getElement()
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => {
      unrender(popup.getElement());
      popup.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(container, film.getElement(), `beforeend`);
};

// Render films
films.slice(filmPageStart, filmPageEnd).forEach((el) => renderFilm(el, filmsContainer));

// Render featured films
filmsTopRated.forEach((el) => renderFilm(el, containerTopRated));
filmsMostCommented.forEach((el) => renderFilm(el, containerMostCommented));

// Footer
const filmsAvailable = document.querySelector(`.footer__statistics`).querySelector(`p`);
filmsAvailable.textContent = `${FilmsCount.TOTAL} movies inside`;

// Load more films
const loadMore = document.querySelector(`.films-list__show-more`);
loadMore.addEventListener(`click`, () => {
  filmPageStart += FilmsCount.PER_PAGE;
  filmPageEnd += FilmsCount.PER_PAGE;

  if (filmPageEnd >= films.length) {
    loadMoreContainer.removeChild(loadMore);
  }

  films.slice(filmPageStart, filmPageEnd).forEach((el) => renderFilm(el, filmsContainer));
});
