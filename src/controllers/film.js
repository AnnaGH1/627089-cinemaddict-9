import Film from "../components/film";
import Popup from "../components/popup";
import {Key, Position, isCtrlEnterKeydown, isCommandEnterKeydown, render, unrender} from "../components/utils";
import {comments, body} from '../components/data';

export default class FilmController {
  constructor(container, data, onDataChange, onViewChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._film = new Film(data);
    this._popup = new Popup(data);
    this._userRatingEl = null;
    this._userCommentEl = null;
  }

  _subscribeOnFilmEvents() {
    // Toggle film controls
    this._film.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-card__controls-item--add-to-watchlist`) || e.target.classList.contains(`film-card__controls-item--mark-as-watched`) || e.target.classList.contains(`film-card__controls-item--favorite`)) {
          e.preventDefault();
          this._onFilmControlClick(e);
        }
      });

    // Open popup
    this._film.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-card__poster`) || e.target.classList.contains(`film-card__title`) || e.target.classList.contains(`film-card__comments`)) {
          this._openPopup();
        }
      });
  }

  _subscribeOnPopupEventsControls() {
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__control-label--watchlist`) || e.target.classList.contains(`film-details__control-label--watched`) || e.target.classList.contains(`film-details__control-label--favorite`)) {
          e.preventDefault();
          this._onPopupControlClick(e);
        }
      });
  }

  _subscribeOnPopupEventsScore() {
    // Add score
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__user-rating-label`)) {
          this._onScoreClick(e);
        }
      });

    // Remove score
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__watched-reset`)) {
          this._onRemoveScoreClick(e);
        }
      });
  }

  _subscribeOnPopupEventsComment() {
    // Add emoji
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.getAttribute(`alt`) === `emoji` && e.target.parentNode.classList.contains(`film-details__emoji-label`)) {
          e.preventDefault();
          this._onEmojiClick(e);
        }
      });

    // Add comment
    this._popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, (e) => {
        // Check if comment is not empty
        if (this._popup.getElement().querySelector(`.film-details__comment-input`).value && (isCtrlEnterKeydown(e) || isCommandEnterKeydown(e))) {
          e.preventDefault();
          this._onCommentSubmit();
        }
      });
  }

  _updateRefPopup() {
    this._userRatingEl = this._popup.getElement().querySelector(`.form-details__middle-container`);
    this._userCommentEl = this._popup.getElement().querySelector(`.film-details__new-comment`);
  }

  _updateHistoryView() {
    if (this._data.isHistory) {
      this._userRatingEl.classList.remove(`visually-hidden`);
      this._userCommentEl.classList.remove(`visually-hidden`);
    } else {
      this._userRatingEl.classList.add(`visually-hidden`);
      this._userCommentEl.classList.add(`visually-hidden`);
    }
  }

  _clearPrevEmoji() {
    this._popup.getElement()
      .querySelectorAll(`.film-details__emoji-item`)
      .forEach((el) => el.removeAttribute(`checked`));
  }

  _openPopup() {
    // Closes popup on Esc keydown
    const onEscKeyDown = (e) => {
      if (e.key === Key.ESCAPE_IE || e.key === Key.ESCAPE) {
        closePopup();
      }
    };

    const closePopup = () => {
      unrender(this._popup.getElement());
      this._popup.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    // Close popup
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.className === `film-details__close-btn`) {
          closePopup();
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

    this._subscribeOnPopupEventsScore();
    this._subscribeOnPopupEventsComment();
    this._subscribeOnPopupEventsControls();

    // Render popup
    render(body, this._popup.getElement(), Position.BEFOREEND);
    this._updateRefPopup();
    this._updateHistoryView();
    document.addEventListener(`keydown`, onEscKeyDown);
  }

  init() {
    this._subscribeOnFilmEvents();
    render(this._container, this._film.getElement(), Position.BEFOREEND);
  }

  _onFilmControlClick(e) {
    e.target.classList.toggle(`film-card__controls-item--active`);
    const isWatchlist = this._film.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .classList.contains(`film-card__controls-item--active`);
    const isHistory = this._film.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .classList.contains(`film-card__controls-item--active`);
    const isFavorites = this._film.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .classList.contains(`film-card__controls-item--active`);
    if (!isHistory) {
      // Removed to history, update data and remove user score
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
        commentsCount: this._data.commentsCount,
        isWatchlist,
        isHistory,
        isFavorites,
        userScore: null,
      };
      this._onDataChange(entry, this._data);
    } else {
      // Other controls toggled, update data
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
        commentsCount: this._data.commentsCount,
        isWatchlist,
        isHistory,
        isFavorites,
        userScore: this._data.userScore,
      };
      this._onDataChange(entry, this._data);
    }
  }

  _onPopupControlClick(e) {
    e.target.previousElementSibling.toggleAttribute(`checked`);
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    if (e.target.classList.contains(`film-details__control-label--watched`) && !e.target.previousElementSibling.hasAttribute(`checked`)) {
      // Removed to history, update data and remove user score
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
        commentsCount: this._data.commentsCount,
        isWatchlist: !!formData.get(`watchlist`),
        isHistory: !!formData.get(`watched`),
        isFavorites: !!formData.get(`favorite`),
        userScore: null,
      };
      this._onDataChange(entry, this._data);
    } else {
      // Other controls toggled, update data
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
        commentsCount: this._data.commentsCount,
        isWatchlist: !!formData.get(`watchlist`),
        isHistory: !!formData.get(`watched`),
        isFavorites: !!formData.get(`favorite`),
        userScore: this._data.userScore,
      };
      this._onDataChange(entry, this._data);
    }
  }

  _onEmojiClick(e) {
    this._clearPrevEmoji();
    e.target.parentNode.previousElementSibling.setAttribute(`checked`, ``);
  }

  _onCommentSubmit() {
    const formEl = this._popup.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(formEl);
    const entry = {
      author: `Author`,
      text: formData.get(`comment`),
      emoji: formData.get(`comment-emoji`) ? formData.get(`comment-emoji`) : `smile`,
      time: Date.now(),
    };
    comments.push(entry);
    formEl.reset();
  }

  _onScoreClick(e) {
    e.preventDefault();
    e.target.previousElementSibling.setAttribute(`checked`, ``);
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
      commentsCount: this._data.commentsCount,
      isWatchlist: this._data.isWatchlist,
      isHistory: this._data.isHistory,
      isFavorites: this._data.isFavorites,
      userScore: e.target.previousElementSibling.value,
    };
    this._onDataChange(entry, this._data);
  }

  _onRemoveScoreClick(e) {
    e.preventDefault();
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
      commentsCount: this._data.commentsCount,
      isWatchlist: this._data.isWatchlist,
      isHistory: this._data.isHistory,
      isFavorites: this._data.isFavorites,
      userScore: null,
    };
    this._onDataChange(entry, this._data);
  }
}
