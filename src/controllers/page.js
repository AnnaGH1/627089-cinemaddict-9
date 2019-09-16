import {Position, Key, render, unrender, renderComponent} from '../components/utils';
import {filters, FilmsCount, sortedByYear, sortedByComments, sortedByRating} from '../components/data';
import {getMainNavTemplate} from '../components/menu';
import Message from '../components/message';
import Film from '../components/film';
import Popup from '../components/popup';
import Show from '../components/show';
import PageLayout from '../components/page-layout';
import Sort from '../components/sort';


class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._pageLayout = new PageLayout();
    this._sort = new Sort();
    this._message = new Message();
    this._show = new Show();
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
    this._filmsContainer = null;
    this._loadMoreContainer = null;
    this._filmsSequence = null;
  }

  _removePreviousFilms() {
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

  _resetPageCounters() {
    this._filmPageStart = 0;
    this._filmPageEnd = FilmsCount.PER_PAGE;
  }

  _renderFilmList(filmsSequence) {
    this._removePreviousFilms();
    this._resetPageCounters();
    this._filmsSequence = filmsSequence;

    // Render films
    this._filmsSequence.slice(this._filmPageStart, this._filmPageEnd).forEach((el) => this._renderFilm(this._filmsContainer, el));

    // Render show more button
    render(this._loadMoreContainer, this._show.getElement(), Position.BEFOREEND);
    this._show.getElement().addEventListener(`click`, this._onShowButtonClick.bind(this));
  }

  _renderFilm(container, item) {
    const film = new Film(item);
    const popup = new Popup(item);
    const body = document.querySelector(`body`);

    // Closes popup on Esc keydown
    const onEscKeyDown = (e) => {
      if (e.key === Key.ESCAPE_IE || e.key === Key.ESCAPE) {
        unrender(popup.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // Open popup
    film.getElement()
      .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
      .forEach((el) => {
        el.addEventListener(`click`, () => {
          render(body, popup.getElement(), Position.BEFOREEND);
          document.addEventListener(`keydown`, onEscKeyDown);
        });
      });

    // Close popup
    popup.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, () => {
        unrender(popup.getElement());
        popup.removeElement();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    // Prevent close on Esc keydown when comment is being made
    popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, () => document.removeEventListener(`keydown`, onEscKeyDown));

    // Allow close on Esc keydown when comment is not being made
    popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => document.addEventListener(`keydown`, onEscKeyDown));

    render(container, film.getElement(), Position.BEFOREEND);
  }

  init() {
    // Show message if there are no films
    if (FilmsCount.TOTAL === 0) {
      render(this._container, this._message.getElement(), Position.BEFOREEND);
    } else {
      // Controls - filters
      renderComponent(this._container, getMainNavTemplate(filters));
      // Controls - sort
      render(this._container, this._sort.getElement(), Position.BEFOREEND);
      this._sort.getElement().addEventListener(`click`, this._onSortLinkClick.bind(this));

      // Render page layout
      render(this._container, this._pageLayout.getElement(), Position.BEFOREEND);

      // Update reference to containers
      this._filmsContainer = this._container.querySelector(`.films-list__container`);
      this._loadMoreContainer = this._container.querySelector(`.films-list`);

      // Render featured films
      const filmsContainersFeatured = this._container.querySelectorAll(`.films-list--extra .films-list__container`);
      const containerTopRated = filmsContainersFeatured[0];
      const containerMostCommented = filmsContainersFeatured[1];
      sortedByRating
        .slice(0, FilmsCount.FEATURED)
        .forEach((el) => this._renderFilm(containerTopRated, el));
      sortedByComments
        .slice(0, FilmsCount.FEATURED)
        .forEach((el) => this._renderFilm(containerMostCommented, el));

      // Render film list
      this._renderFilmList(this._films);

      // Footer
      const filmsAvailable = document.querySelector(`.footer__statistics`).querySelector(`p`);
      filmsAvailable.textContent = `${FilmsCount.TOTAL} movies inside`;

    }
  }

  _onSortLinkClick(e) {
    e.preventDefault();
    if (e.target.tagName !== `A`) {
      return;
    }

    // Get films by sort type
    switch (e.target.dataset.sortType) {
      case `date`:
        this._renderFilmList(sortedByYear);
        break;
      case `rating`:
        this._renderFilmList(sortedByRating);
        break;
      case `default`:
        this._renderFilmList(this._films);
        break;
    }
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
}

export {PageController as default};
