import MainNav from '../components/nav/main-nav';
import {Position, render} from '../utils';

export default class MainNavController {
  constructor(container, films, onFilterClick) {
    this._container = container;
    this._films = films;
    this._onFilterClick = onFilterClick;
    this.mainNav = null;
  }

  init() {
    this.mainNav = new MainNav(this._films);
    this._subscribeOnEvents();
    render(this._container, this.mainNav.getElement(), Position.AFTERBEGIN);
  }

  _removePrevActive() {
    this._container.querySelectorAll(`.main-navigation__item`)
      .forEach((item) => item.classList.remove(`main-navigation__item--active`));
  }

  _subscribeOnEvents() {
    this.mainNav.getElement()
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
          this._container.querySelector(`.sort`).classList.add(`visually-hidden`);
          this._container.querySelector(`.films`).classList.add(`visually-hidden`);

          // Show statistics
          this._container.querySelector(`.statistic`).classList.remove(`visually-hidden`);
        } else {
          // Show sort and film lists
          this._container.querySelector(`.sort`).classList.remove(`visually-hidden`);
          this._container.querySelector(`.films`).classList.remove(`visually-hidden`);

          // Hide statistics
          this._container.querySelector(`.statistic`).classList.add(`visually-hidden`);
          // Apply filters
          this._onFilterClick(e);
        }
      });
  }
}
