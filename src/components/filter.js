import AbstractComponent from './abstract-component';

export default class Filter extends AbstractComponent {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return `<a 
      href="${this._filter.url}" 
      class="main-navigation__item ${this._filter.isActive ? `main-navigation__item--active` : ``} ${this._filter.name === `Stats` ? `main-navigation__item--additional` : ``}">
      ${this._filter.name} ${this._filter.count && `<span class="main-navigation__item-count">${this._filter.count}</span>`}
    </a>`;
  }
}
