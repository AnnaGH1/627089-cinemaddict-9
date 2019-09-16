import AbstractComponent from './abstract-component';

class PageLayout extends AbstractComponent {
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

export {PageLayout as default};
