import AbstractComponent from '../abstract/abstract-component';

export default class Message extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="no-result">There are no movies in our database</div>`;
  }
}
