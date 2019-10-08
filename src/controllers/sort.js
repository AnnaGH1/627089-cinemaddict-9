import Sort from '../components/nav/sort';
import {render, Position} from '../utils';

export default class SortController {
  constructor(container, onSortClick) {
    this._container = container;
    this.sort = new Sort();
    this._onSortClick = onSortClick;
  }

  init() {
    this._subscribeOnEvents();
    render(this._container, this.sort.getElement(), Position.BEFOREEND);
  }

  _removePrevActive() {
    this.sort.getElement()
      .querySelectorAll(`.sort__button`)
      .forEach((item) => item.classList.remove(`sort__button--active`));
  }

  _subscribeOnEvents() {
    this.sort.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.tagName !== `A`) {
          return;
        }

        this._removePrevActive();
        e.target.classList.add(`sort__button--active`);
        this._onSortClick(e);
      });
  }
}
