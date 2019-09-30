import {
  Position,
  render,
  unrender,
  sortByPropDown,
  sortByPropUp,
  Key,
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
import SearchResultCount from '../components/search/search-result-count';
import SearchQuery from '../components/search/search-query';
import User from '../components/user/user';

export default class PageController {
  constructor(container, films, filters) {
    this._container = container;
    this._films = films;
    this._filters = filters;
    this._searchQuery = new SearchQuery();
    this._searchResultCount = null;
    this._user = new User(userType);
    this._pageLayout = new PageLayout();
    this._mainNavContainer = new MainNavContainer();
    this._sort = new Sort();
    this._message = new Message();
    this._filmsContainer = null;
    this._loadMoreContainer = null;
    this._filmListController = null;
  }

  _renderMessage() {
    render(this._container, this._message.getElement(), Position.BEFOREEND);
  }

  _renderSearchQuery() {
    const headerContainer = document.querySelector(`.header`);
    render(headerContainer, this._searchQuery.getElement(), Position.BEFOREEND);

    this._searchQuery.getElement()
      .querySelector(`.search__field`)
      .addEventListener(`keydown`, (e) => {
        if (e.key === Key.ENTER) {
          this._onSearchKeydown(e);
        }
      });

    this._searchQuery.getElement()
      .querySelector(`.search__reset`)
      .addEventListener(`click`, (e) => {
        this._onSearchReset(e);
      });
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

  _renderFilmListsAll() {
    this._filmListController.renderFilmList(this._films);
    this._filmListController.renderFeaturedFilms(this._films);
  }

  _renderSearchResultCount() {
    render(this._container, this._searchResultCount.getElement(), Position.AFTERBEGIN);
  }

  _removeSearchResultCount() {
    unrender(this._searchResultCount.getElement());
    this._searchResultCount.removeElement();
    this._searchResultCount = null;
  }

  _renderSearchResults() {
    this._mainNavContainer.hide();
    this._sort.hide();
    // Mock search results
    const searchResult = this._films.slice(0, 3);
    // Render result count
    this._searchResultCount = new SearchResultCount(searchResult);
    this._renderSearchResultCount();

    // Render message or film list
    if (!searchResult.length) {
      this._filmListController.renderSearchMessage();
    } else {
      this._filmListController._removePrevFeaturedFilms();
      this._filmListController.renderFilmList(searchResult);
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
      this._renderFilmListsAll();

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

    this._filmListController.renderFilmList(sortMap[e.target.dataset.sortType]);
  }

  _onSearchKeydown(e) {
    e.preventDefault();
    this._renderSearchResults();
  }

  _onSearchReset(e) {
    e.preventDefault();
    this._mainNavContainer.show();
    this._sort.show();
    this._removeSearchResultCount();
    this._renderFilmListsAll();
  }
}
