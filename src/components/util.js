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
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {getRandSelection, getRandomIntInclusive};
