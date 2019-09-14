import {Position, Key, createElement, render, unrender} from "./components/utils";
import {IMG_USER, films, filmsTopRated, filmsMostCommented, filters, sortList, userTitle, FilmsCount, PromoCategory} from "./components/data";
import {getSearchTemplate} from "./components/search";
import {getUserTemplate, defineUser} from "./components/users";
import {getMainNavTemplate, getSortTemplate} from "./components/menu";
import {getFilmsCategoriesTemplate} from "./components/films";
import {getMessageTemplate} from "./components/message";
import {Film} from "./components/film";
import {Popup} from "./components/popup";

/**
 * Renders component inside container
 * @param {Element} container
 * @param {string} component
 * @param {string} position for component
 * @return {Element}
 */
const renderComponent = (container, component, position = Position.BEFOREEND) => container.insertAdjacentHTML(position, component);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

// Controls
renderComponent(headerContainer, getSearchTemplate());
renderComponent(headerContainer, getUserTemplate(defineUser(FilmsCount.BY_USER, userTitle, IMG_USER)));

const renderFilm = (container, item) => {
  const film = new Film(item);
  const popup = new Popup(item);
  const body = document.querySelector(`body`);

  // Closes popup on Esc keydown
  const onEscKeyDown = (e) => {
    if (e.key === Key.ESCAPE_IE || e.key === Key.ESCAPE) {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // Open popup
  film.getElement()
    .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
    .forEach((el) => {
      el.addEventListener(`click`, () => {
        render(body, popup.getElement(), Position.BEFOREEND);
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

  // Prevent close on Esc keydown when comment is being made
  popup.getElement()
    .querySelector(`.film-details__comment-input`)
    .addEventListener(`focus`, () => document.removeEventListener(`keydown`, onEscKeyDown));

  // Allow close on Esc keydown when comment is not being made
  popup.getElement()
    .querySelector(`.film-details__comment-input`)
    .addEventListener(`blur`, () => document.addEventListener(`keydown`, onEscKeyDown));

  render(container, film.getElement(), Position.BEFOREEND);
};

if (FilmsCount.TOTAL === 0) {
  render(mainContainer, createElement(getMessageTemplate()), Position.BEFOREEND);
} else {
  // Controls
  renderComponent(mainContainer, getMainNavTemplate(filters));
  renderComponent(mainContainer, getSortTemplate(sortList));

  // Content
  renderComponent(mainContainer, getFilmsCategoriesTemplate(PromoCategory));
  const filmsContainer = mainContainer.querySelector(`.films-list__container`);
  const loadMoreContainer = mainContainer.querySelector(`.films-list`);

  const filmsContainersFeatured = mainContainer.querySelectorAll(`.films-list--extra .films-list__container`);
  const containerTopRated = filmsContainersFeatured[0];
  const containerMostCommented = filmsContainersFeatured[1];

  let filmPageStart = 0;
  let filmPageEnd = FilmsCount.PER_PAGE;

  // Render films
  films.slice(filmPageStart, filmPageEnd).forEach((el) => renderFilm(filmsContainer, el));

  // Render featured films
  filmsTopRated.forEach((el) => renderFilm(containerTopRated, el));
  filmsMostCommented.forEach((el) => renderFilm(containerMostCommented, el));

  // Load more films
  const loadMore = document.querySelector(`.films-list__show-more`);
  loadMore.addEventListener(`click`, () => {
    filmPageStart += FilmsCount.PER_PAGE;
    filmPageEnd += FilmsCount.PER_PAGE;

    if (filmPageEnd >= films.length) {
      loadMoreContainer.removeChild(loadMore);
    }

    films.slice(filmPageStart, filmPageEnd).forEach((el) => renderFilm(filmsContainer, el));
  });
}

// Footer
const filmsAvailable = document.querySelector(`.footer__statistics`).querySelector(`p`);
filmsAvailable.textContent = `${FilmsCount.TOTAL} movies inside`;

