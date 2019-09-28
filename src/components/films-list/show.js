import AbstractComponent from '../abstract/abstract-component';

export default class Show extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}
