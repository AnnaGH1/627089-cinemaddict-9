import AbstractComponent from './abstract-component';

export default class PageLayout extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
        </div>
      </section>
      ${PageLayout.getTopRatedTemplate()}
      ${PageLayout.getMostCommentedTemplate()}
    </section>`;
  }

  static getTopRatedTemplate() {
    return `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>`;
  }

  static getMostCommentedTemplate() {
    return `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>`;
  }
}
