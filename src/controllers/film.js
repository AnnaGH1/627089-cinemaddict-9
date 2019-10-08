import FilmCard from "../components/film-mode/film-card";
import FilmPopup from "../components/film-mode/film-popup";
import {Key, Position, isCtrlEnterKeydown, isCommandEnterKeydown, render, unrender, createElement} from "../utils";
import {body} from '../helper/const';
import {api} from '../main';
import {RequestType} from '../helper/const';

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
    this._commentInput = null;
    this._emojiPreviewContainer = null;
    this._popupForm = null;
    this._commentToDelete = null;
    this._scoreSelected = null;
    this._updateCommentView = this._updateCommentView.bind(this);
    this._renderNewComment = this._renderNewComment.bind(this);
    this._showCommentError = this._showCommentError.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onScoreClick = this._onScoreClick.bind(this);
    this._onScoreUndoClick = this._onScoreUndoClick.bind(this);
    this._updateRatingView = this._updateRatingView.bind(this);
    this._showRatingError = this._showRatingError.bind(this);
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

  _uploadFilmChangesPopup() {
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userScoreEl = this._popup.getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelector(`input[type=radio]:checked`);

    const entry = {
      id: this._data.id,
      title: this._data.title,
      titleAlt: this._data.titleAlt,
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
      isWatchlist: !!formData.get(`watchlist`),
      isHistory: !!formData.get(`watched`),
      isFavorites: !!formData.get(`favorite`),
      userScore: userScoreEl ? Number(userScoreEl.value) : 0,
      watchingDate: this._data.watchingDate,
    };

    this._onDataChange(entry, RequestType.FILM);
  }

  _uploadFilmChangesScore() {
    // Reset rating section
    this._popupForm.setAttribute(`disabled`, ``);
    this._userRatingEl.classList.remove(`shake`);

    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));

    const entry = {
      id: this._data.id,
      title: this._data.title,
      titleAlt: this._data.titleAlt,
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
      isWatchlist: !!formData.get(`watchlist`),
      isHistory: !!formData.get(`watched`),
      isFavorites: !!formData.get(`favorite`),
      userScore: this._scoreSelected ? Number(this._scoreSelected.value) : 0,
      watchingDate: this._data.watchingDate,
    };

    this._onDataChange(
        entry,
        RequestType.RATING,
        null,
        null,
        null,
        null,
        null,
        this._updateRatingView,
        this._showRatingError
    );
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
          this._uploadFilmChangesPopup();
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
      .querySelectorAll(`.film-details__user-rating-label`)
      .forEach((el) => {
        el.addEventListener(`click`, this._onScoreClick);
      });

    // Remove score
    this._popup.getElement()
      .querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onScoreUndoClick);
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
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((el) => {
        el.addEventListener(`click`, this._onCommentDelete);
      });
  }

  _updateCommentView() {
    const commentEl = document.getElementById(this._commentToDelete);
    const commentDelEl = commentEl.querySelector(`.film-details__comment-delete`);
    // Remove event listener from delete btn
    commentDelEl.removeEventListener(`click`, this._onCommentDelete);

    // Remove comment element
    commentEl.parentNode.removeChild(commentEl);
    this._commentToDelete = null;
    // Update comments count
    this._commentsCountEl = this._popup.getElement()
      .querySelector(`.film-details__comments-count`);
    this._commentsCountEl.textContent = Number(this._commentsCountEl.textContent) - 1;
  }

  _renderNewComment(comment) {
    // Add comment element
    render(this._commentsContainer, createElement(FilmPopup.getCommentTemplate(comment)), Position.BEFOREEND);

    // Enable form
    this._commentInput.removeAttribute(`disabled`);
    this._commentInput.classList.remove(`film-details__comment-input--error`);
    this._popupForm.reset();

    // Clear preview
    this._emojiPreviewContainer.innerHTML = ``;

    // Update comments count
    this._commentsCountEl = this._popup.getElement()
      .querySelector(`.film-details__comments-count`);
    this._commentsCountEl.textContent = Number(this._commentsCountEl.textContent) + 1;
  }

  _showCommentError() {
    // Enable form
    this._commentInput.removeAttribute(`disabled`);

    // Styles
    this._commentInput.classList.add(`shake`);
    this._commentInput.classList.add(`film-details__comment-input--error`);
  }

  _updateRatingView() {
    if (this._scoreSelected) {
      this._scoreSelected.setAttribute(`checked`, ``);
    } else {
      this._clearScorePopup();
    }
  }

  _showRatingError() {
    this._popupForm.removeAttribute(`disabled`);
    this._userRatingEl.classList.add(`shake`);
    if (this._scoreSelected) {
      this._scoreSelected.nextElementSibling
        .classList.add(`score-error`);
    }
  }

  _clearScorePopup() {
    this._userScoreEl = this._popup.getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelector(`input[type=radio]:checked`);
    if (this._userScoreEl) {
      this._userScoreEl.removeAttribute(`checked`);
    }
  }

  _clearRatingErrorStyle() {
    this._popup.getElement()
      .querySelectorAll(`.film-details__user-rating-label`)
      .forEach((el) => el.classList.remove(`score-error`));
  }

  _updateRefPopup() {
    this._popupForm = this._popup.getElement().querySelector(`.film-details__inner`);
    this._userRatingEl = this._popup.getElement().querySelector(`.form-details__middle-container`);
    this._commentsContainer = this._popup.getElement().querySelector(`.film-details__comments-list`);
    this._userCommentEl = this._popup.getElement().querySelector(`.film-details__new-comment`);
    this._emojiPreviewContainer = this._popup.getElement().querySelector(`.film-details__add-emoji-label`);
    this._commentInput = this._popup.getElement().querySelector(`.film-details__comment-input`);
  }

  _clearPrevEmoji() {
    // Clear data
    this._popup.getElement()
      .querySelectorAll(`.film-details__emoji-item`)
      .forEach((el) => el.removeAttribute(`checked`));

    // Clear preview
    this._emojiPreviewContainer.innerHTML = ``;
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
    document.addEventListener(`keydown`, onEscKeyDown);
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
        id: this._data.id,
        title: this._data.title,
        titleAlt: this._data.titleAlt,
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
        watchingDate: this._data.watchingDate,
      };
      this._onDataChange(entry, RequestType.FILM);
    } else {
      // Other controls toggled, update data
      const entry = {
        id: this._data.id,
        title: this._data.title,
        titleAlt: this._data.titleAlt,
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
        watchingDate: this._data.watchingDate,
      };
      this._onDataChange(entry, RequestType.FILM);
    }
  }

  _onEmojiClick(e) {
    this._clearPrevEmoji();
    const emojiInput = e.target.parentNode.previousElementSibling;
    emojiInput.setAttribute(`checked`, ``);
    render(this._emojiPreviewContainer, createElement(FilmPopup.getEmotionPreviewTemplate(emojiInput.value)), Position.BEFOREEND);
  }

  _onCommentSubmit() {
    const formDataComment = new FormData(this._popupForm);
    const entry = {
      author: `Author`,
      text: formDataComment.get(`comment`),
      emoji: formDataComment.get(`comment-emoji`) ? formDataComment.get(`comment-emoji`) : `smile`,
      time: new Date(),
    };

    // Disable comment input
    this._commentInput.setAttribute(`disabled`, ``);

    // Remove error styles
    this._commentInput.classList.remove(`shake`);
    this._commentInput.classList.remove(`film-details__comment-input--error`);

    this._onDataChange(entry, RequestType.COMMENT.ADD, this._data.id, this._renderNewComment, null, null, this._showCommentError);
  }

  _onCommentDelete(e) {
    e.preventDefault();
    this._commentToDelete = Number(e.target.parentNode.parentNode.parentNode.id);
    this._onDataChange(null, RequestType.COMMENT.DELETE, null, null, this._commentToDelete, this._updateCommentView);
  }

  _onScoreClick(e) {
    e.preventDefault();
    this._clearRatingErrorStyle();
    this._scoreSelected = e.target.previousElementSibling;
    this._uploadFilmChangesScore();
  }

  _onScoreUndoClick(e) {
    e.preventDefault();
    this._clearRatingErrorStyle();
    this._scoreSelected = null;
    this._uploadFilmChangesScore();
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
