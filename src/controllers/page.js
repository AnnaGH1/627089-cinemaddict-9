import {
  Position,
  render,
  unrender,
  sortByPropDown,
} from '../utils';
import {
  FilmsCount,
  filmsCountEl,
  userType,
} from '../helper/const';
import Message from '../components/films-list/message';
import PageLayout from '../components/films-list/page-layout';
import MainNavController from './main-nav';
import SortController from './sort';
import StatisticsController from './statistics';
import FilmListController from './film-list';
import SearchController from './search';
import SearchResultCount from '../components/search/search-result-count';
import User from '../components/user/user';

export default class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._user = new User(userType);
    this._pageLayout = new PageLayout();
    this._mainNavController = null;
    this._sortController = null;
    this._statisticsController = null;
    this._message = new Message();
    this._filmsContainer = null;
    this._loadMoreContainer = null;
    this._filmListController = null;
    this._searchController = null;
    this._searchResultCount = null;
    this._updateMainNav = this._updateMainNav.bind(this);
    this._updateStatistics = this._updateStatistics.bind(this);
    this._onSearchEntry = this._onSearchEntry.bind(this);
    this._onSearchReset = this._onSearchReset.bind(this);
    this._onFilterClick = this._onFilterClick.bind(this);
    this._onSortClick = this._onSortClick.bind(this);
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
      this._renderMainNav(this._films);
      this._renderSort();
      this._renderPageLayout();

      // Statistics
      this._renderStatistics(this._films);

      // Films list
      this._filmListController = new FilmListController(this._filmsContainer, this._loadMoreContainer, this._films, this._updateMainNav, this._updateStatistics);
      this._filmListController.renderFilmListMain(this._films);
      this._filmListController.renderFeaturedFilms(this._films);

      // Footer
      this._updateFilmsCount(filmsCountEl);
    }
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

  _renderMainNav(films) {
    this._mainNavController = new MainNavController(this._container, films, this._onFilterClick);
    this._mainNavController.init();
  }

  _renderSort() {
    this._sortController = new SortController(this._container, this._onSortClick);
    this._sortController.init();
  }

  _renderStatistics(films) {
    const mainContainer = document.querySelector(`.main`);
    const filmsWatched = films.filter((el) => el.isHistory);
    this._statisticsController = new StatisticsController(mainContainer, filmsWatched);
    this._statisticsController.init();
  }

  _updateStatistics(films) {
    unrender(this._statisticsController.statistics.getElement());
    this._statisticsController.statistics.removeElement();
    this._renderStatistics(films);
  }

  _renderPageLayout() {
    render(this._container, this._pageLayout.getElement(), Position.BEFOREEND);
    // Update reference to containers
    this._filmsContainer = this._container.querySelector(`.films-list__container`);
    this._loadMoreContainer = this._container.querySelector(`.films-list`);
  }

  _updateFilmsCount(el) {
    el.textContent = `${this._films.length} movies inside`;
  }

  _updateNoFilms(el) {
    el.textContent = ``;
  }

  _updateMainNav(films) {
    unrender(this._mainNavController.mainNav.getElement());
    this._mainNavController.mainNav.removeElement();
    this._renderMainNav(films);
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
    this._mainNavController.mainNav.hide();
    this._sortController.sort.hide();

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
      this._filmListController.removePrevFeaturedFilms();
      this._filmListController.renderFilmListMain(filmsFound);
    }
  }

  _onFilterClick(e) {
    e.preventDefault();

    const filterMap = {
      all: this._films,
      watchlist: this._films.filter((el) => el.isWatchlist),
      history: this._films.filter((el) => el.isHistory),
      favorites: this._films.filter((el) => el.isFavorites),
    };

    if (e.target.dataset.filterType !== `all`) {
      this._filmListController.removePrevFeaturedFilms();
      this._filmListController.renderFilmListMain(filterMap[e.target.dataset.filterType]);
    } else {
      this._filmListController.renderFilmListMain(filterMap[e.target.dataset.filterType]);
      this._filmListController.renderFeaturedFilms(this._films);
    }
  }

  _onSortClick(e) {
    e.preventDefault();
    if (e.target.tagName !== `A`) {
      return;
    }

    const sortMap = {
      date: sortByPropDown(this._films, `year`),
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
    this._searchController.searchRun = false;
    this._mainNavController.mainNav.show();
    this._sortController.sort.show();
    // If rendered from prev search - remove
    if (this._searchResultCount) {
      this._removeSearchResultCount();
    }
    this._filmListController.renderFilmListMain(this._films);
    this._filmListController.renderFeaturedFilms(this._films);
  }
}
