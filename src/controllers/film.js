import FilmCard from "../components/film-mode/film-card";
import FilmPopup from "../components/film-mode/film-popup";
import {Key, Position, isCtrlEnterKeydown, isCommandEnterKeydown, render, unrender, createElement} from "../utils";
import {body} from '../helper/const';
import {api} from '../main';

export default class FilmController {
  constructor(container, data, onDataChange, onViewChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._film = new FilmCard(data);
    this._popup = null;
    this._userRatingEl = null;
    this._userScoreEl = null;
    this._userCommentEl = null;
    this._commentsCountEl = null;
    this._commentsContainer = null;
    this._emojiPreviewContainer = null;
    this._newComments = [];
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
          e.preventDefault();
          // Load comments
          api
            .getComments(this._data.id)
            .then((comments) => {
              this._popup = new FilmPopup(this._data, comments);
              // Close previous popups
              this._onViewChange();
              this._openPopup();
            });
        }
      });
  }

  _subscribeOnPopupEventsControls() {
    // Toggle controls
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`film-details__control-label--watchlist`) || e.target.classList.contains(`film-details__control-label--watched`) || e.target.classList.contains(`film-details__control-label--favorite`)) {
          e.preventDefault();
          e.target.previousElementSibling.toggleAttribute(`checked`);

          // Clear rating if removed from history
          if (e.target.classList.contains(`film-details__control-label--watched`) && !e.target.previousElementSibling.hasAttribute(`checked`)) {
            this._clearScorePopup();
          }
        }
      });

    // Toggle rating section
    this._popup.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._onWatchedControlClick(e);
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
          e.preventDefault();
          this._clearScorePopup();
        }
      });
  }

  _subscribeOnPopupEventsComment() {
    // Add emoji
    this._popup.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.tagName === `IMG` && e.target.parentNode.classList.contains(`film-details__emoji-label`)) {
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

    // Remove comment element
    this._popup.getElement()
      .querySelectorAll(`.film-details__comment`)
      .forEach((el) => {
        el.addEventListener(`click`, (e) => {
          if (e.target.classList.contains(`film-details__comment-delete`)) {
            e.preventDefault();
            e.currentTarget.parentNode.removeChild(e.currentTarget);

            // Update comments count
            this._commentsCountEl = this._popup.getElement()
              .querySelector(`.film-details__comments-count`);
            this._commentsCountEl.textContent = Number(this._commentsCountEl.textContent) - 1;
          }
        });
      });
  }

  _updateRefPopup() {
    this._commentsContainer = this._popup.getElement().querySelector(`.film-details__comments-list`);
    this._userRatingEl = this._popup.getElement().querySelector(`.form-details__middle-container`);
    this._userCommentEl = this._popup.getElement().querySelector(`.film-details__new-comment`);
    this._emojiPreviewContainer = this._popup.getElement().querySelector(`.film-details__add-emoji-label`);
  }

  _clearPrevEmoji() {
    // Clear data
    this._popup.getElement()
      .querySelectorAll(`.film-details__emoji-item`)
      .forEach((el) => el.removeAttribute(`checked`));

    // Clear preview
    this._emojiPreviewContainer.innerHTML = ``;
  }

  _saveDataOnPopupClose() {
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userScoreEl = this._popup.getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelector(`input[type=radio]:checked`);

    const comments = this._newComments.length ? [...this._newComments, ...this._data.comments] : this._data.comments;

    const entry = {
      id: this._data.id,
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
      commentsIds: this._data.commentsIds,
      comments,
      isWatchlist: !!formData.get(`watchlist`),
      isHistory: !!formData.get(`watched`),
      isFavorites: !!formData.get(`favorite`),
      userScore: userScoreEl ? userScoreEl.value : null,
    };

    this._onDataChange(entry, this._data);
  }

  _openPopup() {
    // Closes popup on Esc keydown
    const onEscKeyDown = (e) => {
      if (e.key === Key.ESCAPE_IE || e.key === Key.ESCAPE) {
        closePopup();
      }
    };

    const closePopup = () => {
      this._saveDataOnPopupClose();

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
    document.addEventListener(`keydown`, onEscKeyDown);
  }

  setDefaultView() {
    // Check if popup was instantiated and rendered
    if (this._popup && this._popup.getElement()) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
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
      // Removed from history, update data and remove user score
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
        commentsIds: this._data.commentsIds,
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
        commentsIds: this._data.commentsIds,
        isWatchlist,
        isHistory,
        isFavorites,
        userScore: this._data.userScore,
      };
      this._onDataChange(entry, this._data);
    }
  }

  _onEmojiClick(e) {
    this._clearPrevEmoji();
    const emojiInput = e.target.parentNode.previousElementSibling;
    emojiInput.setAttribute(`checked`, ``);
    render(this._emojiPreviewContainer, createElement(FilmPopup.getEmotionPreviewTemplate(emojiInput.value)), Position.BEFOREEND);
  }

  _onCommentSubmit() {
    const formEl = this._popup.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(formEl);
    const entryComment = {
      author: `Author`,
      text: formData.get(`comment`),
      emoji: formData.get(`comment-emoji`) ? formData.get(`comment-emoji`) : `smile`,
      time: Date.now(),
    };
    this._newComments.unshift(entryComment);

    // Add comment element
    render(this._commentsContainer, createElement(FilmPopup.getCommentTemplate(entryComment)), Position.AFTERBEGIN);

    // Update comments count
    this._commentsCountEl = this._popup.getElement()
      .querySelector(`.film-details__comments-count`);
    this._commentsCountEl.textContent = Number(this._commentsCountEl.textContent) + 1;

    formEl.reset();
    // Clear preview
    this._emojiPreviewContainer.innerHTML = ``;
  }

  _onScoreClick(e) {
    e.preventDefault();
    e.target.previousElementSibling.setAttribute(`checked`, ``);
  }

  _clearScorePopup() {
    this._userScoreEl = this._popup.getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelector(`input[type=radio]:checked`);
    if (this._userScoreEl) {
      this._userScoreEl.removeAttribute(`checked`);
    }
  }

  _onWatchedControlClick(e) {
    // Update view depending on watched control state
    if (e.target.previousElementSibling.hasAttribute(`checked`)) {
      this._userRatingEl.classList.add(`visually-hidden`);
      this._userCommentEl.classList.add(`visually-hidden`);
    } else {
      this._userRatingEl.classList.remove(`visually-hidden`);
      this._userCommentEl.classList.remove(`visually-hidden`);
    }
  }
}
