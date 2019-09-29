import AbstractComponent from '../abstract/abstract-component';

export default class SearchResult extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return `<div>
        <div class="result">
          <p class="result__text">Result <span class="result__count">${this._films.length}</span></p>
        </div>
        <section class="films">
          <section class="films-list">
          </section>
        </section>
    </div>`;
  }
}
