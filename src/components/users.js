/**
 * Gets user template
 * @param {Object} userData
 * @return {string}
 */
const getUserTemplate = (userData) => `
  <section class="header__profile profile">
    <p class="profile__rating">${userData.title}</p>
    <img class="profile__avatar" src="${userData.url}" alt="Avatar" width="35" height="35">
  </section>
`;

/**
 * Assigns title to user based on a number of films watched
 * @param {number} count
 * @param {Object} title
 * @param {string} image
 * @return {Object}
 */
const defineUser = (count, title, image) => {
  const user = {};
  user.url = image;
  for (let key of Object.keys(title)) {
    if (title[key].isHolder(count, title[key])) {
      user.title = title[key].title;
      break;
    }
  }
  return user;
};

export {getUserTemplate, defineUser};
