import Statistics from '../components/statistics/statistics';
import {Position, render} from '../utils';

export default class StatisticsController {
  constructor(container) {
    this._container = container;
    this._statistics = new Statistics();
  }

  _renderStatistics() {
    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
  }

  init() {
    this._renderStatistics();
  }
}
