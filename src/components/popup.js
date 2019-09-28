import AbstractComponent from './abstract-component';
import {getRandSelection, getNounForm} from './utils';
import {userScores, comments} from './data';
import moment from 'moment';

export default class Popup extends AbstractComponent {
  constructor(film) {
    super();
    this._title = film.title;
    this._category = film.category;
    this._rating = film.rating;
    this._year = film.year;
    this._duration = film.duration;
    this._country = film.country;
    this._director = film.director;
    this._writers = film.writers;
    this._actors = film.actors;
    this._genres = film.genres;
    this._url = film.url;
    this._description = film.description;
    this._commentsCount = film.commentsCount;
    this._isWatchlist = film.isWatchlist;
    this._isHistory = film.isHistory;
    this._isFavorites = film.isFavorites;
    this._userScore = film.userScore;
    this._getScoreTemplate = this._getScoreTemplate.bind(this);
  }

  /**
   * Gets film details
   * @return {string}
   */
  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._url}" alt="${this._title}">
  
            <p class="film-details__age">${this._category}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._title}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${[...this._writers].join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${[...this._actors].join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${this._year}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${getNounForm(`Genre`, this._genres.size)}</td>
                <td class="film-details__cell">
                    ${[...this._genres].map(Popup.getGenreTemplate).join(``)}
                  </td>
              </tr>
            </table>
  
            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isHistory ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorites ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      ${this._getUserRatingTemplate()}    
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._commentsCount}</span></h3>
  
          <ul class="film-details__comments-list">
            ${getRandSelection(comments, this._commentsCount).map(Popup.getCommentTemplate).join(``)}
          </ul>
  
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
  }

  _getUserRatingTemplate() {
    return `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._url}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
                ${userScores.map(this._getScoreTemplate).join(``)}
            </div>
          </section>
        </div>
      </section>
    </div>`;
  }

  _getScoreTemplate(score) {
    return `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${score}" id="rating-${score}" ${this._userScore === score.toString() ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${score}">${score}</label>`;
  }

  /**
   * Gets genre template
   * @param {string} genre
   * @return {string}
   */
  static getGenreTemplate(genre) {
    return `<span class="film-details__genre">${genre}</span>`;
  }

  /**
   * Gets comment template
   * @param {Object} comment
   * @return {string}
   */
  static getCommentTemplate(comment) {
    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${moment(comment.time).format(`MMM DD YYYY kk:mm`)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
}
