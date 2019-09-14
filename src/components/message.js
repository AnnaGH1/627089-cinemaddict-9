import AbstractComponent from './abstract-component';

class Message extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="no-result">There are no movies in our database</div>`;
  }
}

export {Message as default};
