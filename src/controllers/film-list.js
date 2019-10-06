import dompurify from 'dompurify';
import {getRandSelection, Position, render, sortByPropDown, unrender} from '../utils';
import {FilmsCount, PromoCategory} from '../helper/const';
import FilmController from './film';
import Show from '../components/films-list/show';
import FeaturedContainer from '../components/films-featured/featured-container';
import SearchMessage from '../components/search/search-message';
import {api} from '../main';
import {RequestType} from '../helper/const';

export default class FilmListController {
  constructor(filmsContainer, loadMoreContainer, films, updateMainNav, updateStatistics) {
    this._filmsContainer = filmsContainer;
    this._loadMoreContainer = loadMoreContainer;
    this._films = films;
    this._filmsSequence = null;
    this._topRated = null;
    this._mostCommented = null;
    this._extraContainerRating = new FeaturedContainer(PromoCategory.RATING);
    this._extraContainerComments = new FeaturedContainer(PromoCategory.COMMENTS);
    this._show = new Show();
    this._isShowRendered = false;
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._searchMessage = new SearchMessage();
    this._updateMainNav = updateMainNav;
    this._updateStatistics = updateStatistics;
  }

  _removePrevFilms() {
    // Reset previous films sequence
    this._filmsSequence = null;

    // Remove previous films elements or search message
    this._filmsContainer.innerHTML = ``;

    // If rendered, remove show more button corresponding to the previous films
    if (this._isShowRendered) {
      unrender(this._show.getElement());
      this._show.removeElement();
      this._isShowRendered = false;
    }
  }

  _resetPageCounters() {
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
  }

  _renderFilm(container, item) {
    const filmController = new FilmController(container, item, this._onDataChange, this._onViewChange);
    filmController.init();
    this._subscriptions.push(filmController.setDefaultView.bind(filmController));
  }

  renderFilmListMain(filmsSequence) {
    this._removePrevFilms();
    this._resetPageCounters();
    this._filmsSequence = filmsSequence;

    // Render films
    this._filmsSequence.slice(this._filmPageStart, this._filmPageEnd).forEach((el) => this._renderFilm(this._filmsContainer, el));

    // Render show more button if film list is long enough
    if (filmsSequence.length > FilmsCount.PER_PAGE) {
      render(this._loadMoreContainer, this._show.getElement(), Position.BEFOREEND);
      this._show.getElement().addEventListener(`click`, this._onShowButtonClick.bind(this));
      this._isShowRendered = true;
    }
  }

  renderFeaturedFilms(films) {
    this._removePrevFeaturedFilms();
    this._renderTopRated(films);
    this._renderMostCommented(films);
  }

  _removePrevFeaturedFilms() {
    unrender(this._extraContainerRating.getElement());
    this._extraContainerRating.removeElement();
    unrender(this._extraContainerComments.getElement());
    this._extraContainerComments.removeElement();
  }

  _renderTopRated(films) {
    const nonZeroRated = sortByPropDown(films, `rating`).filter((film) => film.rating > 0);
    // Do not render if all films have zero rating
    if (!nonZeroRated.length) {
      return;
    }
    // Render extra containers
    const filmsContainerOuter = this._loadMoreContainer.parentNode;
    render(filmsContainerOuter, this._extraContainerRating.getElement(), Position.BEFOREEND);
    const containerTopRated = this._extraContainerRating.getElement().querySelector(`.films-list__container`);
    // Check if all films have equal rating
    const rating = films[0].rating;
    const isEqualRating = nonZeroRated.every((el) => el[`rating`] === rating);

    // Get films selection
    if (isEqualRating) {
      this._topRated = getRandSelection(nonZeroRated, FilmsCount.FEATURED);
    } else {
      this._topRated = nonZeroRated.slice(0, FilmsCount.FEATURED);
    }
    this._topRated.forEach((el) => this._renderFilm(containerTopRated, el));
  }

  _renderMostCommented(films) {
    const commented = films.filter((film) => film.commentsIds.length > 0);
    // Do not render if all films have no comments
    if (!commented.length) {
      return;
    }
    // Render extra containers
    const filmsContainerOuter = this._loadMoreContainer.parentNode;
    render(filmsContainerOuter, this._extraContainerComments.getElement(), Position.BEFOREEND);
    const containerMostCommented = this._extraContainerComments.getElement().querySelector(`.films-list__container`);
    // Check if all films have equal comments count
    const commentsCount = commented[0].commentsIds.length;
    const isEqualCommentsCount = commented.every((el) => el[`commentsIds`].length === commentsCount);

    // Get films selection
    if (isEqualCommentsCount) {
      this._mostCommented = getRandSelection(commented, FilmsCount.FEATURED);
    } else {
      const commentedDesc = commented.sort((a, b) => b[`commentsIds`].length - a[`commentsIds`].length);
      this._mostCommented = commentedDesc.slice(0, FilmsCount.FEATURED);
    }

    this._mostCommented
      .forEach((el) => this._renderFilm(containerMostCommented, el));
  }

  renderSearchMessage() {
    this._removePrevFilms();
    this._resetPageCounters();
    this._removePrevFeaturedFilms();

    render(this._filmsContainer, this._searchMessage.getElement(), Position.BEFOREEND);
  }

  _onShowButtonClick() {
    this._filmPageStart += FilmsCount.PER_PAGE;
    this._filmPageEnd += FilmsCount.PER_PAGE;

    if (this._filmPageEnd >= this._filmsSequence.length) {
      // Remove show more button when last film is rendered
      unrender(this._show.getElement());
      this._show.removeElement();
      this._isShowRendered = false;
    }

    this._filmsSequence.slice(this._filmPageStart, this._filmPageEnd).forEach((el) => this._renderFilm(this._filmsContainer, el));
  }

  _onDataChange(
      newData,
      type,
      idFilm,
      renderComment,
      idComment,
      updateCommentView
  ) {
    switch (type) {
      case RequestType.FILM:
        // Upload changes
        api
          .updateFilm(newData.id, newData)
          .then(() => {
            // Update page
            api
              .getFilms()
              .then((films) => {
                this.renderFilmListMain(films);
                this.renderFeaturedFilms(films);
                this._updateMainNav(films);
                this._updateStatistics(films);
              });
          });
        break;
      case RequestType.COMMENT.ADD:
        api
          .createComment(newData, idFilm)
          .then(() => {
            const newDataClean = {
              author: newData.author,
              text: dompurify.sanitize(newData.text),
              emoji: newData.emoji,
              time: newData.time,
            };
            renderComment(newDataClean);
          });
        break;
      case RequestType.COMMENT.DELETE:
        api.deleteComment(idComment)
          .then(() => {
            updateCommentView();
          });
    }
  }

  _onViewChange() {
    this._subscriptions.forEach((el) => el());
  }
}
