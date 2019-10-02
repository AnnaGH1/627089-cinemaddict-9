import {
  Position,
  render,
  unrender,
  sortByPropDown,
  sortByPropUp,
} from '../utils';
import {
  FilmsCount,
  filmsCountEl,
  userType,
} from '../helper';
import Message from '../components/films-list/message';
import PageLayout from '../components/films-list/page-layout';
import MainNavContainer from '../components/nav/main-nav-container';
import Sort from '../components/nav/sort';
import MainNavItemController from './main-nav-item';
import FilmListController from './film-list';
import SearchController from './search';
import SearchResultCount from '../components/search/search-result-count';
import User from '../components/user/user';

export default class PageController {
  constructor(container, films, filters) {
    this._container = container;
    this._films = films;
    this._filters = filters;
    this._searchResultCount = null;
    this._user = new User(userType);
    this._pageLayout = new PageLayout();
    this._mainNavContainer = new MainNavContainer();
    this._sort = new Sort();
    this._message = new Message();
    this._filmsContainer = null;
    this._loadMoreContainer = null;
    this._filmListController = null;
    this._searchController = null;
    this._onSearchEntry = this._onSearchEntry.bind(this);
    this._onSearchReset = this._onSearchReset.bind(this);
  }

  _renderMessage() {
    render(this._container, this._message.getElement(), Position.BEFOREEND);
  }

  _renderSearchQuery() {
    const headerContainer = document.querySelector(`.header`);
    this._searchController = new SearchController(headerContainer, this._onSearchEntry, this._onSearchReset);
    this._searchController.init();
  }

  _renderUser() {
    const headerContainer = document.querySelector(`.header`);
    render(headerContainer, this._user.getElement(), Position.BEFOREEND);
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

  _updateFilmsCount(el) {
    el.textContent = `${FilmsCount.TOTAL} movies inside`;
  }

  _updateNoFilms(el) {
    el.textContent = ``;
  }

  _renderSearchResultCount() {
    render(this._container, this._searchResultCount.getElement(), Position.AFTERBEGIN);
  }

  _removeSearchResultCount() {
    unrender(this._searchResultCount.getElement());
    this._searchResultCount.removeElement();
    this._searchResultCount = null;
  }

  _renderSearchResults(filmsFound) {
    this._mainNavContainer.hide();
    this._sort.hide();

    // If rendered from prev search - remove
    if (this._searchResultCount) {
      this._removeSearchResultCount();
    }

    // Render result count
    this._searchResultCount = new SearchResultCount(filmsFound);
    this._renderSearchResultCount();

    // Render message or film list
    if (!filmsFound.length) {
      this._filmListController.renderSearchMessage();
    } else {
      this._filmListController._removePrevFeaturedFilms();
      this._filmListController.renderFilmListMain(filmsFound);
    }
  }

  init() {
    // Show message if there are no films
    if (!FilmsCount.TOTAL) {
      this._renderMessage();
      this._updateNoFilms(filmsCountEl);
    } else {
      // Render page otherwise
      // Header
      this._renderSearchQuery();
      this._renderUser();

      // Controls and layout
      this._renderFilters();
      this._renderSort();
      this._renderPageLayout();

      // Films list
      this._filmListController = new FilmListController(this._filmsContainer, this._loadMoreContainer, this._films);
      this._filmListController.renderFilmListMain(this._films);
      this._filmListController.renderFeaturedFilms(this._films);
      // Footer
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

    this._filmListController.renderFilmListMain(sortMap[e.target.dataset.sortType]);
  }

  _onSearchEntry(e) {
    e.preventDefault();
    let filmsFound = [];
    const queryNoPunctuation = e.target.value
      .replace(/[^\w\s]|_/g, ``);
    const query = new RegExp(queryNoPunctuation, `i`);
    this._films.forEach((film) => {
      if (film.title.match(query)) {
        filmsFound.push(film);
      }
    });
    this._renderSearchResults(filmsFound);
  }

  _onSearchReset(e) {
    e.preventDefault();
    // Update search status
    this._searchController._searchRun = false;
    this._mainNavContainer.show();
    this._sort.show();
    // If rendered from prev search - remove
    if (this._searchResultCount) {
      this._removeSearchResultCount();
    }
    this._filmListController.renderFilmListMain(this._films);
    this._filmListController.renderFeaturedFilms(this._films);
  }
}
