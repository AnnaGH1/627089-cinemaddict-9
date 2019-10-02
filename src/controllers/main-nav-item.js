import MainNavItem from '../components/nav/main-nav-item';
import {Position, render} from '../utils';

export default class MainNavItemController {
  constructor(container, data) {
    this._container = container;
    this._data = data;
  }

  _subscribeOnEvents() {
    // Toggle statistics
    this._container
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`main-navigation__item--additional`)) {
          e.preventDefault();
          document.querySelector(`.statistic`).classList.toggle(`visually-hidden`);
        }
      });
  }

  init() {
    this._subscribeOnEvents();
    this._data.forEach((el) => {
      const navItem = new MainNavItem(el);
      render(this._container, navItem.getElement(), Position.BEFOREEND);
    });
  }
}
