import {
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
export const emotions = [`smile`, `sleeping`, `puke`, `angry`];
export const userScores = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const userType = defineUser(FilmsCount.BY_USER, userTitle, IMG_USER);

export const Stats = {
  TIMEFRAME_DEFAULT: `all-time`,
  MILLISECONDS: {
    today: 86400000,
    week: 604800000,
    month: 2628000000,
    year: 31536000000,
  },
};

export const RequestType = {
  FILM: `film`,
  COMMENT: {
    ADD: `add`,
    DELETE: `delete`,
  },
  RATING: `rating`,
};

export const RESPONSE_STATUS = {
  SUCCESS: {
    MIN: 200,
    MAX: 299,
  }
};

export const body = document.querySelector(`body`);
export const filmsCountEl = document.querySelector(`.footer__statistics`).querySelector(`p`);
