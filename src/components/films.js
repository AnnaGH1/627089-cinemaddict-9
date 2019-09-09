import {getShowMoreTemplate} from "./showMore";

/**
 * Gets films categories template
 * @param {Object} promoCategory
 * @return {string}
 */
const getFilmsCategoriesTemplate = (promoCategory) => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
      ${getShowMoreTemplate()}
    </section>
    ${Object.values(promoCategory).map(getFeaturedCategoryTemplate).join(``)}
  </section>
`;

/**
 * Gets featured category template
 * @param {string} title
 * @return {string}
 */
const getFeaturedCategoryTemplate = (title) => `
    <section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>
`;

export {getFilmsCategoriesTemplate};
