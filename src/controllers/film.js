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
}
