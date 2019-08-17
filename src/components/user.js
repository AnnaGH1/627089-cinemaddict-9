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

const user = {
  rating: `Movie Buff`,
  url: `images/bitmap@2x.png`
};

export {getUserTemplate, user};
