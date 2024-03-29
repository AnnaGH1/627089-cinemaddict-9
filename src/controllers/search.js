import SearchQuery from '../components/search/search-query';
import {Position, render} from '../utils';
import {QUERY_LENGTH_MIN} from '../helper/const';

export default class SearchController {
  constructor(container, onSearchEntry, onSearchReset) {
    this._container = container;
    this._onSearchEntry = onSearchEntry;
    this._onSearchReset = onSearchReset;
    this._searchQuery = new SearchQuery();
    this.searchRun = false;
  }

  init() {
    this._subscribeOnEvents();
    render(this._container, this._searchQuery.getElement(), Position.BEFOREEND);
  }

  _subscribeOnEvents() {
    // Run search
    this._searchQuery.getElement()
      .querySelector(`.search__field`)
      .addEventListener(`keyup`, (e) => {
        if (e.target.value.length >= QUERY_LENGTH_MIN) {
          // Update search status
          this.searchRun = true;
          this._onSearchEntry(e);
        }
      });

    // Reset after search - query cleared after previous search
    this._searchQuery.getElement()
      .querySelector(`.search__field`)
      .addEventListener(`input`, (e) => {
        if (this.searchRun) {
          if (!e.target.value) {
            this._onSearchReset(e);
          }
        }
      });

    // Reset after search - close button
    this._searchQuery.getElement()
      .querySelector(`.search__reset`)
      .addEventListener(`click`, (e) => {
        this._onSearchReset(e);
      });
  }
}
