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
 * @param {number} filmsCountData
 * @param {Object} titlesData
 * @return {Object}
 */
const defineUser = (filmsCountData, titlesData) => {
  const user = {};
  user.url = `images/bitmap@2x.png`;
  if (filmsCountData > titlesData.movieBuff.min) {
    user.title = `Movie Buff`;
  } else if (filmsCountData >= titlesData.fan.min && filmsCountData <= titlesData.fan.max) {
    user.title = `Fan`;
  } else if (filmsCountData >= titlesData.novice.min && filmsCountData <= titlesData.novice.max) {
    user.title = `Novice`;
  } else {
    user.title = ``;
  }
  return user;
};

export {getUserTemplate, defineUser};
