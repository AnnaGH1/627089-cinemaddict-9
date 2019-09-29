import AbstractComponent from '../abstract/abstract-component';

export default class MainNavItem extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return `<a 
      href="${this._data.url}" 
      class="main-navigation__item ${this._data.isActive ? `main-navigation__item--active` : ``} ${this._data.name === `Stats` ? `main-navigation__item--additional` : ``}">
      ${this._data.name} ${this._data.count && `<span class="main-navigation__item-count">${this._data.count}</span>`}
    </a>`;
  }
}
