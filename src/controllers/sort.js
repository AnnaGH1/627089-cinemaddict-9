import Sort from '../components/nav/sort';
import {render, Position} from '../utils';

export default class SortController {
  constructor(container, onSortClick) {
    this._container = container;
    this._sort = new Sort();
    this._onSortClick = onSortClick;
  }

  _removePrevActive() {
    this._sort.getElement()
      .querySelectorAll(`.sort__button`)
      .forEach((item) => item.classList.remove(`sort__button--active`));
  }

  _subscribeOnEvents() {
    this._sort.getElement()
      .addEventListener(`click`, (e) => {
        if (e.target.tagName !== `A`) {
          return;
        }

        this._removePrevActive();
        e.target.classList.add(`sort__button--active`);
        this._onSortClick(e);
      });
  }

  init() {
    this._subscribeOnEvents();
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
  }
}
