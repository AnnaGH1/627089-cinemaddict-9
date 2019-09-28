import AbstractComponent from '../abstract/abstract-component';

export default class User extends AbstractComponent {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._user.title}</p>
    <img class="profile__avatar" src="${this._user.url}" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
