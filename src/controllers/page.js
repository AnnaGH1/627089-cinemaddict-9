import {
  Position,
  render,
  sortByPropDown,
  sortByPropUp,
} from '../utils';
import {
  FilmsCount,
  filmsCountEl,
} from '../helper';
import Message from '../components/films-list/message';
import PageLayout from '../components/films-list/page-layout';
import MainNavContainer from '../components/nav/main-nav-container';
import Sort from '../components/nav/sort';
import MainNavItemController from './main-nav-item';
import FilmListController from './film-list';

export default class PageController {
  constructor(container, films, filters) {
    this._container = container;
    this._films = films;
    this._filters = filters;
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

  _renderFilmListStart() {
    this._filmListController.renderFilmList(this._films);
    this._filmListController.renderFeaturedFilms(this._films);
  }

  init() {
    // Show message if there are no films
    if (!FilmsCount.TOTAL) {
      this._renderMessage();
      this._updateNoFilms(filmsCountEl);
    } else {
      // Render page otherwise
      // Controls and layout
      this._renderFilters();
      this._renderSort();
      this._renderPageLayout();

      // Films list
      this._filmListController = new FilmListController(this._filmsContainer, this._loadMoreContainer, this._films);
      this._renderFilmListStart();

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
}
