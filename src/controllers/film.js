import Film from "../components/film";
import Popup from "../components/popup";
import {Key, Position, render, unrender} from "../components/utils";
import {body} from '../components/data';

export default class FilmController {
  constructor(container, data, onDataChange, onViewChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._film = new Film(data);
    this._popup = new Popup(data);
  }

  _openPopup() {
    // Closes popup on Esc keydown
    const onEscKeyDown = (e) => {
      if (e.key === Key.ESCAPE_IE || e.key === Key.ESCAPE) {
        unrender(this._popup.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    render(body, this._popup.getElement(), Position.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);

    // Close popup
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.className === `film-details__close-btn`) {
          unrender(this._popup.getElement());
          this._popup.removeElement();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      });

    // Prevent close on Esc keydown when comment is being made
    this._popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, () => document.removeEventListener(`keydown`, onEscKeyDown));

    // Allow close on Esc keydown when comment is not being made
    this._popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => document.addEventListener(`keydown`, onEscKeyDown));

    // Toggle watchlist
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__control-label--watchlist`)) {
          e.preventDefault();
          this._onPopupControlClick(e);
        }
      });

    // Toggle history
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__control-label--watched`)) {
          e.preventDefault();
          this._onPopupControlClick(e);
        }
      });

    // Toggle favorites
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__control-label--favorite`)) {
          e.preventDefault();
          this._onPopupControlClick(e);
        }
      });
  }

  init() {
    // Open popup handler
    this._film.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.className === `film-card__poster` || `film-card__title` || `film-card__comments`) {
          this._openPopup();
        }
      });

    render(this._container, this._film.getElement(), Position.BEFOREEND);
  }

  _onPopupControlClick(e) {
    e.target.previousElementSibling.toggleAttribute(`checked`);
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const entry = {
      title: this._data.title,
      category: this._data.category,
      rating: this._data.rating,
      year: this._data.year,
      duration: this._data.duration,
      country: this._data.country,
      director: this._data.director,
      writers: this._data.writers,
      actors: this._data.actors,
      genres: this._data.genres,
      url: this._data.url,
      description: this._data.description,
      comments: this._data.comments,
      isWatchlist: !!formData.get(`watchlist`),
      isHistory: !!formData.get(`watched`),
      isFavorites: !!formData.get(`favorite`),
    };

    this._onDataChange(entry, this._data);
  }
}
