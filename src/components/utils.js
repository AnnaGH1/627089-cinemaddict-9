export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};
export const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
};

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
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

/**
 * Renders element
 * @param {Element} container
 * @param {Element} element
 * @param {string} place
 * @return {*|void}
 */
export const render = (container, element, place) => renderMap[place](container, element);

/**
 * Unrenders element
 * @param {Element} element
 * @return {Element}
 */
export const unrender = (element) => element ? element.remove() : element;


/**
 * Renders component inside container
 * @param {Element} container
 * @param {string} component
 * @param {string} position for component
 * @return {Element}
 */
export const renderComponent = (container, component, position = Position.BEFOREEND) => container.insertAdjacentHTML(position, component);

/**
 * Gets random elements from array
 * @param {Array} arr
 * @param {number} count
 * @return {Array}
 */
export const getRandSelection = (arr, count) => {
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
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} string
 * @return {string}
 */
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Counts all films
 * @param {Array} films
 * @return {number}
 */
export const countAll = (films) => films.length;

/**
 * Counts films by flag
 * @param {Array} films
 * @param {string} flag
 * @return {number}
 */
export const countByFlag = (films, flag) => films.filter((el) => el[flag]).length;

/**
 * Assigns an empty string for Stats count
 * @return {string}
 */
export const countStats = () => ``;

/**
 * Checks user title based on a number of films watched
 * @param {number} count
 * @param {Object} title
 * @return {boolean}
 */
export const isHolder = (count, title) => count >= title.min && count <= title.max;

/**
 * Sorts array elements in descending order by property
 * @param {Array.<Object>} list
 * @param {string} prop
 * @return {Array}
 */
export const sortByPropDown = (list, prop) => list.slice().sort((a, b) => b[prop] - a[prop]);

/**
 * Sorts array elements in ascending order by property
 * @param {Array.<Object>} list
 * @param {string} prop
 * @return {Array}
 */
export const sortByPropUp = (list, prop) => list.slice().sort((a, b) => a[prop] - b[prop]);
