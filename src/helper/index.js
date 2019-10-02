import {
  capitalizeFirstLetter,
  countAll,
  countByFlag,
  countStats,
  isHolder,
  defineUser
} from '../utils';

export const QUERY_LENGTH_MIN = 3;
export const IMG_USER = `./images/bitmap@2x.png`;
export const PromoCategory = {
  RATING: `Top rated`,
  COMMENTS: `Most commented`,
};
export const FilmsCount = {
  TOTAL: 16,
  PER_PAGE: 5,
  BY_USER: 1,
  FEATURED: 2,
};
export const userTitle = {
  novice: {
    title: `Novice`,
    isHolder,
    min: 1,
    max: 10,
  },
  fan: {
    title: `Fan`,
    isHolder,
    min: 11,
    max: 20,
  },
  movieBuff: {
    title: `Movie Buff`,
    isHolder,
    min: 21,
    max: FilmsCount.TOTAL,
  },
};
export const userScores = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const FilterMap = {
  all: countAll,
  watchlist: countByFlag,
  history: countByFlag,
  favorites: countByFlag,
  stats: countStats,
};

/**
 * Gets filters data
 * @param {Object} filtersData - names and count functions
 * @param {Array} filmsData
 * @return {Array}
 */
export const getFilters = (filtersData, filmsData) => {
  const filters = [];
  Object.keys(filtersData).forEach((key) => {
    const name = (key === `all`) ? `${capitalizeFirstLetter(key)} movies` : capitalizeFirstLetter(key);
    const flag = `is${capitalizeFirstLetter(key)}`;
    filters.push({
      name,
      url: `#${key}`,
      count: filtersData[key](filmsData, flag),
      isActive: false,
    });
  });
  return filters;
};

export const userType = defineUser(FilmsCount.BY_USER, userTitle, IMG_USER);

export const body = document.querySelector(`body`);
export const filmsCountEl = document.querySelector(`.footer__statistics`).querySelector(`p`);
