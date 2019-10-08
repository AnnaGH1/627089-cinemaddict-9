import {
  isHolder,
  defineUser
} from '../utils';

const QUERY_LENGTH_MIN = 3;
const IMG_USER = `./images/bitmap@2x.png`;
const PromoCategory = {
  RATING: `Top rated`,
  COMMENTS: `Most commented`,
};
const FilmsCount = {
  TOTAL: 16,
  PER_PAGE: 5,
  BY_USER: 1,
  FEATURED: 2,
};
const userTitle = {
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
const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];
const USER_SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const userType = defineUser(FilmsCount.BY_USER, userTitle, IMG_USER);

const Stats = {
  TIMEFRAME_DEFAULT: `all-time`,
  MILLISECONDS: {
    today: 86400000,
    week: 604800000,
    month: 2628000000,
    year: 31536000000,
  },
};

const RequestType = {
  FILM: `film`,
  COMMENT: {
    ADD: `add`,
    DELETE: `delete`,
  },
  RATING: `rating`,
};

const RESPONSE_STATUS = {
  SUCCESS: {
    MIN: 200,
    MAX: 299,
  }
};

const body = document.querySelector(`body`);
const filmsCountEl = document.querySelector(`.footer__statistics`).querySelector(`p`);

export {
  QUERY_LENGTH_MIN,
  IMG_USER,
  PromoCategory,
  FilmsCount,
  userTitle,
  EMOTIONS,
  USER_SCORES,
  userType,
  Stats,
  RequestType,
  RESPONSE_STATUS,
  body,
  filmsCountEl,
};
