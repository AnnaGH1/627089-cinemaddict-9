import MainNav from '../components/nav/main-nav';
import {Position, render} from '../utils';

export default class MainNavController {
  constructor(container, films, onFilterClick, sortEl) {
    this._container = container;
    this._films = films;
    this._onFilterClick = onFilterClick;
    this._sortEl = sortEl;
    this._mainNav = null;
  }

  _removePrevActive() {
    this._container.querySelectorAll(`.main-navigation__item`)
      .forEach((item) => item.classList.remove(`main-navigation__item--active`));
  }

  _subscribeOnEvents() {
    this._mainNav.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.tagName !== `A`) {
          return;
        }

        // Highlight current nav item
        this._removePrevActive();
        e.target.classList.add(`main-navigation__item--active`);

        if (e.target.classList.contains(`main-navigation__item--additional`)) {
          e.preventDefault();

          // Hide sort and film lists
          this._sortEl.hide();
          this._container.querySelector(`.films`).classList.add(`visually-hidden`);

          // Show statistics
          this._container.querySelector(`.statistic`).classList.remove(`visually-hidden`);
        } else {
          // Show sort and film lists
          this._sortEl.show();
          this._container.querySelector(`.films`).classList.remove(`visually-hidden`);

          // Hide statistics
          this._container.querySelector(`.statistic`).classList.add(`visually-hidden`);
          // Apply filters
          this._onFilterClick(e);
        }
      });
  }

  init() {
    this._mainNav = new MainNav(this._films);
    this._subscribeOnEvents();
    render(this._container, this._mainNav.getElement(), Position.AFTERBEGIN);
  }
}
