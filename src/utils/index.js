const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};
const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
  ENTER: `Enter`,
};

const MINS_IN_HOUR = 60;

const isCtrlEnterKeydown = (e) => e.ctrlKey && e.key === Key.ENTER;

const isCommandEnterKeydown = (e) => e.metaKey && e.key === Key.ENTER;

/**
 * Prepends element to container
 * @param {Element} container
 * @param {Element} element
 * @return {*|void}
 */
const prepend = (container, element) => container.prepend(element);

/**
 * Appends element to container
 * @param {Element} container
 * @param {Element} element
 * @return {*|void}
 */
const append = (container, element) => container.append(element);

const renderMap = {
  afterbegin: prepend,
  beforeend: append,
};

/**
 * Creates Element
 * @param {string} template
 * @return {ChildNode}
 */
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

/**
 * Renders element
 * @param {Node} container
 * @param {Node} element
 * @param {string} place
 * @return {*|void}
 */
const render = (container, element, place) => renderMap[place](container, element);

/**
 * Unrenders element
 * @param {Element} element
 * @return {Element}
 */
const unrender = (element) => element ? element.remove() : element;

/**
 * Gets random elements from array
 * @param {Array} arr
 * @param {number} count
 * @return {Array}
 */
const getRandSelection = (arr, count) => {
  const selection = [];
  while (selection.length < count) {
    selection.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return selection;
};

/**
 * Gets random integer inclusive
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Counts films by flag
 * @param {Array} films
 * @param {string} flag
 * @return {number}
 */
const countByFlag = (films, flag) => films.filter((el) => el[flag]).length;

/**
 * Checks user title based on a number of films watched
 * @param {number} count
 * @param {Object} title
 * @return {boolean}
 */
const isHolder = (count, title) => count >= title.min && count <= title.max;

/**
 * Sorts array elements in descending order by property
 * @param {Array.<Object>} list
 * @param {string} prop
 * @return {Array}
 */
const sortByPropDown = (list, prop) => list.slice().sort((a, b) => b[prop] - a[prop]);

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

/**
 * Get singular or plural noun form
 * @param {string} noun
 * @param {number} count
 * @return {string}
 */
const getNounForm = (noun, count) => count === 1 ? noun : noun + `s`;

/**
 * Get number of full hours from mins
 * @param {number} mins
 * @return {number}
 */
const minsToHours = (mins) => Math.floor(mins / MINS_IN_HOUR);

/**
 * Get the remaining number of minutes after full hours
 * @param {number} mins
 * @return {number}
 */
const minsToHoursRemainder = (mins) => mins % MINS_IN_HOUR;

/**
 * Get keys corresponding to the max value in an object
 * @param {Object} object
 * @return {Array}
 */
const getMax = (object) => {
  return Object.keys(object).filter((x) => {
    return object[x] === Math.max.apply(null,
        Object.values(object));
  });
};

export {
  Position,
  Key,
  isCtrlEnterKeydown,
  isCommandEnterKeydown,
  createElement,
  render,
  unrender,
  getRandSelection,
  getRandomIntInclusive,
  countByFlag,
  isHolder,
  sortByPropDown,
  defineUser,
  getNounForm,
  minsToHours,
  minsToHoursRemainder,
  getMax,
};
