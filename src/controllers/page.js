import {
  Position,
  render,
  unrender,
  sortByPropDown,
  sortByPropUp,
  getRandSelection
} from '../utils';
import {
  FilmsCount,
  filmsCountEl,
  PromoCategory,
} from '../helper';
import Message from '../components/films-list/message';
import Show from '../components/films-list/show';
import PageLayout from '../components/films-list/page-layout';
import FeaturedContainer from '../components/films-featured/featured-container';
import MainNavContainer from '../components/nav/main-nav-container';
import Sort from '../components/nav/sort';
import FilmController from './film';
import MainNavItemController from './main-nav-item';

export default class PageController {
  constructor(container, films, filters) {
    this._container = container;
    this._films = films;
    this._topRated = null;
    this._mostCommented = null;
    this._filters = filters;
    this._pageLayout = new PageLayout();
    this._extraContainerRating = new FeaturedContainer(PromoCategory.RATING);
    this._extraContainerComments = new FeaturedContainer(PromoCategory.COMMENTS);
    this._mainNavContainer = new MainNavContainer();
    this._sort = new Sort();
    this._message = new Message();
    this._show = new Show();
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
    this._filmsContainer = null;
    this._loadMoreContainer = null;
    this._filmsSequence = null;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _renderMessage() {
    render(this._container, this._message.getElement(), Position.BEFOREEND);
  }

  _renderFilters() {
    render(this._container, this._mainNavContainer.getElement(), Position.BEFOREEND);
    const navItemController = new MainNavItemController(this._mainNavContainer.getElement(), this._filters);
    navItemController.init();
  }

  _renderSort() {
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    this._sort.getElement().addEventListener(`click`, this._onSortLinkClick.bind(this));
  }

  _renderPageLayout() {
    render(this._container, this._pageLayout.getElement(), Position.BEFOREEND);
    // Update reference to containers
    this._filmsContainer = this._container.querySelector(`.films-list__container`);
    this._loadMoreContainer = this._container.querySelector(`.films-list`);
  }

  _renderFeaturedFilms(films) {
    this._removePrevFeaturedFilms();
    this._renderTopRated(films);
    this._renderMostCommented(films);
  }

  _renderTopRated(films) {
    const nonZeroRated = sortByPropDown(films, `rating`).filter((film) => film.rating > 0);
    // Do not render if all films have zero rating
    if (!nonZeroRated.length) {
      return;
    }
    // Render extra containers
    const filmsContainerOuter = this._container.querySelector(`.films`);
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
    const commented = sortByPropDown(films, `commentsCount`).filter((film) => film.commentsCount > 0);
    // Do not render if all films have no comments
    if (!commented.length) {
      return;
    }
    // Render extra containers
    const filmsContainerOuter = this._container.querySelector(`.films`);
    render(filmsContainerOuter, this._extraContainerComments.getElement(), Position.BEFOREEND);
    const containerMostCommented = this._extraContainerComments.getElement().querySelector(`.films-list__container`);
    // Check if all films have equal comments count
    const commentsCount = films[0].commentsCount;
    const isEqualCommentsCount = commented.every((el) => el[`commentsCount`] === commentsCount);

    // Get films selection
    if (isEqualCommentsCount) {
      this._mostCommented = getRandSelection(commented, FilmsCount.FEATURED);
    } else {
      this._mostCommented = commented.slice(0, FilmsCount.FEATURED);
    }

    this._mostCommented
      .forEach((el) => this._renderFilm(containerMostCommented, el));
  }

  _updateFilmsCount(el) {
    el.textContent = `${FilmsCount.TOTAL} movies inside`;
  }

  _updateNoFilms(el) {
    el.textContent = ``;
  }

  _removePrevFilms() {
    // Reset previous films sequence
    this._filmsSequence = null;

    // Remove previous films elements
    this._filmsContainer.innerHTML = ``;

    // If rendered, remove show more button corresponding to the previous films
    if (this._show._element) {
      unrender(this._show.getElement());
      this._show.removeElement();
    }
  }

  _removePrevFeaturedFilms() {
    unrender(this._extraContainerRating.getElement());
    this._extraContainerRating.removeElement();
    unrender(this._extraContainerComments.getElement());
    this._extraContainerComments.removeElement();
  }

  _resetPageCounters() {
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
  }

  _renderFilmList(filmsSequence) {
    this._removePrevFilms();
    this._resetPageCounters();
    this._filmsSequence = filmsSequence;

    // Render films
    this._filmsSequence.slice(this._filmPageStart, this._filmPageEnd).forEach((el) => this._renderFilm(this._filmsContainer, el));

    // Render show more button
    render(this._loadMoreContainer, this._show.getElement(), Position.BEFOREEND);
    this._show.getElement().addEventListener(`click`, this._onShowButtonClick.bind(this));
  }

  _renderFilm(container, item) {
    const filmController = new FilmController(container, item, this._onDataChange, this._onViewChange);
    filmController.init();
    this._subscriptions.push(filmController.setDefaultView.bind(filmController));
  }

  init() {
    // Show message if there are no films
    if (!FilmsCount.TOTAL) {
      this._renderMessage();
      this._updateNoFilms(filmsCountEl);
    } else {
      // Render page otherwise
      this._renderFilters();
      this._renderSort();
      this._renderPageLayout();
      this._renderFilmList(this._films);
      this._renderFeaturedFilms(this._films);
      this._updateFilmsCount(filmsCountEl);
    }
  }

  _onSortLinkClick(e) {
    e.preventDefault();
    if (e.target.tagName !== `A`) {
      return;
    }

    const sortMap = {
      date: sortByPropUp(this._films, `year`),
      rating: sortByPropDown(this._films, `rating`),
      default: this._films,
    };

    this._renderFilmList(sortMap[e.target.dataset.sortType]);
  }

  _onShowButtonClick() {
    this._filmPageStart += FilmsCount.PER_PAGE;
    this._filmPageEnd += FilmsCount.PER_PAGE;

    if (this._filmPageEnd >= this._filmsSequence.length) {
      // Remove show more button when last film is rendered
      unrender(this._show.getElement());
      this._show.removeElement();
    }

    this._filmsSequence.slice(this._filmPageStart, this._filmPageEnd).forEach((el) => this._renderFilm(this._filmsContainer, el));
  }

  _onDataChange(newData, oldData) {
    this._films[this._films.findIndex((el) => el === oldData)] = newData;
    this._renderFilmList(this._films);
    this._renderFeaturedFilms(this._films);
  }

  _onViewChange() {
    this._subscriptions.forEach((el) => el());
  }
}
