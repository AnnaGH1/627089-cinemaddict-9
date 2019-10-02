import AbstractComponent from '../abstract/abstract-component';

export default class SearchMessage extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="no-result">There is no movies for your request.</div>`;
  }
}
