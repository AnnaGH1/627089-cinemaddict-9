import AbstractComponent from '../abstract/abstract-component';

export default class MainNavContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<nav class="main-navigation"></nav>`;
  }
}
