import AbstractComponent from '../abstract/abstract-component';

export default class FilterContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<nav class="main-navigation"></nav>`;
  }
}
