/**
 * Gets user template
 * @param {Object} user
 * @return {string}
 */
const getUserTemplate = (user) => `
  <section class="header__profile profile">
    <p class="profile__rating">${user.rating}</p>
    <img class="profile__avatar" src="${user.url}" alt="Avatar" width="35" height="35">
  </section>
`;

const users = [
  {
    rating: `Movie Buff`,
    url: `images/bitmap@2x.png`
  },
  {
    rating: `Movie Buff 2`,
    url: `images/bitmap@2x.png`
  }
];

export {getUserTemplate, users};
