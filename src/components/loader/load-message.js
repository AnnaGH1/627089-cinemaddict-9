import AbstractComponent from '../abstract/abstract-component';

export default class LoadMessage extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="load-message">Loading...</div>`;
  }
}
