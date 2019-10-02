import AbstractComponent from '../abstract/abstract-component';
import {countByFlag} from '../../utils';

export default class MainNav extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return `<nav class="main-navigation">
        <a 
          href="#all" 
          data-filter-type="all"
          class="main-navigation__item">
          All
        </a>
        <a 
          href="#watchlist" 
          data-filter-type="watchlist"
          class="main-navigation__item">
          Watchlist 
          <span class="main-navigation__item-count">
            ${countByFlag(this._films, `isWatchlist`)}
          </span>
          </a>
        <a 
          href="#history" 
          data-filter-type="history"
          class="main-navigation__item">
          History 
          <span class="main-navigation__item-count">
            ${countByFlag(this._films, `isHistory`)}
          </span>
        </a>
        <a 
          href="#favorites" 
          data-filter-type="favorites"
          class="main-navigation__item">
          Favorites 
          <span class="main-navigation__item-count">
            ${countByFlag(this._films, `isFavorites`)}
          </span>
        </a>
        <a 
          href="#stats" 
          class="main-navigation__item main-navigation__item--additional">
          Stats
        </a>
    </nav>`;
  }
}
