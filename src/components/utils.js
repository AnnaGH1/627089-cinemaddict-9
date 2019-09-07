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
 * Capitalizes the first letter of a string
 * @param {string} string
 * @return {string}
 */
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Counts all films
 * @param {Array} films
 * @return {number}
 */
const countAll = (films) => films.length;

/**
 * Counts films by flag
 * @param {Array} films
 * @param {string} flag
 * @return {number}
 */
const countByFlag = (films, flag) => films.filter((el) => el[flag]).length;

/**
 * Assigns an empty string for Stats count
 * @return {string}
 */
const countStats = () => ``;

export {getRandSelection, getRandomIntInclusive, capitalizeFirstLetter, countAll, countByFlag, countStats};
