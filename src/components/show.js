import AbstractComponent from './abstract-component';

class Show extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export {Show as default};
