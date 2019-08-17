/**
 * Gets navigation item template
 * @param {Object} item
 * @return {string}
 */
const getNavItemTemplate = (item) => `
    <a 
      href="${item.url}" 
      class="main-navigation__item ${item.isActive ? `main-navigation__item--active` : ``} ${item.name === `Stats` ? `main-navigation__item--additional` : ``}">
      ${item.name} ${item.count && `<span class="main-navigation__item-count">${item.count}</span>`}
    </a>
`;

/**
 * Gets main navigation template
 * @param {Array} list
 * @return {string}
 */
const getMainNavTemplate = (list) => `
  <nav class="main-navigation">
    ${list.map(getNavItemTemplate).join(``)}
  </nav>
`;

/**
 * Gets sort item template
 * @param {Object} item
 * @return {string}
 */
const getSortItemTemplate = (item) => `
  <li>
    <a href="${item.url}" class="sort__button ${item.isActive ? `sort__button--active` : ``}">Sort by ${item.name}</a>
  </li>
`;

/**
 * Gets sort template
 * @param {Array} list
 * @return {string}
 */
const getSortTemplate = (list) => `
  <ul class="sort">
    ${list.map(getSortItemTemplate).join(``)}
  </ul>
`;

const navList = [
  {
    name: `All movies`,
    isActive: true,
    count: ``,
    url: `#all`
  },
  {
    name: `Watchlist`,
    isActive: false,
    count: 13,
    url: `#watchlist`
  },
  {
    name: `History`,
    isActive: false,
    count: 4,
    url: `#history`
  },
  {
    name: `Favorites`,
    isActive: false,
    count: 8,
    url: `#favorites`
  },
  {
    name: `Stats`,
    isActive: false,
    count: ``,
    url: `stats`
  }
];
const sortList = [
  {
    name: `default`,
    isActive: true,
    url: `#`
  },
  {
    name: `date`,
    isActive: false,
    url: `#`
  },
  {
    name: `rating`,
    isActive: false,
    url: `#`
  },
];

export {getMainNavTemplate, getSortTemplate, navList, sortList};