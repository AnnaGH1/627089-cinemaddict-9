import {Position, render, unrender, sortByPropDown, sortByPropUp} from '../components/utils';
import {FilmsCount, filmsCountEl} from '../components/data';
import Message from '../components/message';
import Show from '../components/show';
import PageLayout from '../components/page-layout';
import FilterContainer from '../components/filter-container';
import Filter from '../components/filter';
import Sort from '../components/sort';
import FilmController from './film';

export default class PageController {
  constructor(container, films, filters) {
    this._container = container;
    this._films = films;
    this._filters = filters;
    this._pageLayout = new PageLayout();
    this._filterContainer = new FilterContainer();
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
    render(this._container, this._filterContainer.getElement(), Position.BEFOREEND);
    this._filters.forEach((el) => {
      const filter = new Filter(el);
      render(this._filterContainer.getElement(), filter.getElement(), Position.BEFOREEND);
    });
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
    const filmsContainersFeatured = this._container.querySelectorAll(`.films-list--extra .films-list__container`);
    const containerTopRated = filmsContainersFeatured[0];
    const containerMostCommented = filmsContainersFeatured[1];
    const sortedByRating = sortByPropDown(films, `rating`);
    const sortedByComments = sortByPropDown(films, `comments`);

    sortedByRating
      .slice(0, FilmsCount.FEATURED)
      .forEach((el) => this._renderFilm(containerTopRated, el));
    sortedByComments
      .slice(0, FilmsCount.FEATURED)
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
    this._container.querySelectorAll(`.films-list--extra .films-list__container`)
      .forEach((el) => {
        el.innerHTML = ``;
      });
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
