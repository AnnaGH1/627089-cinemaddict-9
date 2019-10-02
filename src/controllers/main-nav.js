import MainNav from '../components/nav/main-nav';
import {Position, render} from '../utils';

export default class MainNavController {
  constructor(container, films, onFilterClick) {
    this._container = container;
    this._films = films;
    this._onFilterClick = onFilterClick;
    this._mainNav = null;
  }

  init() {
    this._mainNav = new MainNav(this._films);
    render(this._container, this._mainNav.getElement(), Position.AFTERBEGIN);

    // Subscribe on events
    this._mainNav.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.tagName !== `A`) {
          return;
        }
        // Toggle statistics
        if (e.target.classList.contains(`main-navigation__item--additional`)) {
          e.preventDefault();
          document.querySelector(`.statistic`).classList.toggle(`visually-hidden`);
        } else {
          // Apply filters
          this._onFilterClick(e);
        }
      });

  }
}
