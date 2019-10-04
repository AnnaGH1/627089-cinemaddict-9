import AbstractComponent from '../abstract/abstract-component';
import {getNounForm, minsToHours, minsToHoursRemainder} from '../../utils';

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._title = film.title;
    this._rating = film.rating;
    this._year = film.year;
    this._duration = film.duration;
    this._genres = film.genres;
    this._url = film.url;
    this._description = film.description;
    this._commentsIds = film.commentsIds;
    this._isWatchlist = film.isWatchlist;
    this._isHistory = film.isHistory;
    this._isFavorites = film.isFavorites;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._year}</span>
      <span class="film-card__duration">${minsToHours(this._duration)} h ${minsToHoursRemainder(this._duration)} m</span>
      <span class="film-card__genre">${this._genres[0]}</span>
    </p>
    <img src="./${this._url}" alt="${this._title}" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <a class="film-card__comments">${this._commentsIds.length} ${getNounForm(`comment`, this._commentsIds.length)}</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isHistory ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorites ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
  </article>`;
  }
}
