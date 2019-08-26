import {getShowMoreTemplate} from "./showMore";

/**
 * Gets film template
 * @param {Object} film
 * @return {string}
 */
const getFilmTemplate = (film) => `
  <article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${film.duration}</span>
      <span class="film-card__genre">${Array.from(film.genres)[0]}</span>
    </p>
    <img src="${film.url}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.description}</p>
    <a class="film-card__comments">${film.comments} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isToWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
  </article>
`;

/**
 * Gets films list template
 * @return {string}
 */
const getFilmsListTemplate = () => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
      ${getShowMoreTemplate()}
    </section>
  </section>
`;

/**
 * Gets films items template
 * @param {Array} filmsData
 * @return {string}
 */
const getFilmsItemsTemplate = (filmsData) => `
  ${filmsData.map(getFilmTemplate).join(``)}
`;

/**
 * Gets featured films template
 * @param {Array} filmsData
 * @return {string}
 */
const getFeaturedFilmsTemplate = (filmsData) => `
    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
        ${getFilmTemplate(filmsData[0])}
        ${getFilmTemplate(filmsData[2])}
      </div>
    </section>
    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        ${getFilmTemplate(filmsData[3])}
        ${getFilmTemplate(filmsData[4])}
      </div>
    </section>
`;

export {getFilmsListTemplate, getFilmsItemsTemplate, getFeaturedFilmsTemplate};
