import SearchResult from '../components/search/search-result';
import SearchResultEmpty from '../components/search/search-result-empty';
import {Position, render} from '../utils';
import {films} from '../model/data';

export default class SearchController {
  constructor(container) {
    this._container = container;
    this._searchResult = new SearchResult(films);
    this._searchResultEmpty = new SearchResultEmpty();
  }

  init() {
    render(this._container, this._searchResultEmpty.getElement(), Position.BEFOREEND);
  }
}
