import AbstractComponent from '../abstract/abstract-component';

export default class SearchResultCount extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return `<div class="result">
          <p class="result__text">Result <span class="result__count">${this._films.length}</span></p>
      </div>`;
  }
}
