import Statistics from '../components/statistics/statistics';
import {Position, render, getMax, getRandSelection, unrender} from '../utils';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Stats} from '../helper/const';

export default class StatisticsController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this.statistics = null;
    this._currentValues = null;
    this._userHistoryChart = null;
  }

  init() {
    this._setCurrentValues(this._films);
    this._render(Stats.TIMEFRAME_DEFAULT);
  }

  _getFilmsTimeframe(period) {
    return this._films.filter((el) => el.watchingDate > Date.now() - period);
  }

  _setCurrentValues(films) {
    // Count
    const count = films.length;

    // Duration
    let duration = 0;
    films.forEach((el) => {
      duration += el.duration;
    });

    // Unique genres
    const genres = [];
    films.forEach((el) => genres.push(...el.genres));
    const genresUnique = [...new Set(genres)];

    // Count by genre
    const genresMap = {};
    genresUnique.forEach((genre) => {
      genresMap[genre] = films.filter((film) => film.genres.includes(genre)).length;
    });

    // Top genre
    const topGenre = getRandSelection(getMax(genresMap), 1)[0];

    this._currentValues = {count, duration, genresMap, topGenre};
  }

  _removePrevStatistics() {
    unrender(this.statistics.getElement());
    this.statistics.removeElement();
  }

  _subscribeOnEvents() {
    this.statistics.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`statistic__filters-label`)) {
          e.preventDefault();
          this._onTimeframeClick(e);
        }
      });
  }

  _markCurrentTimeframe(timeframe) {
    this.statistics.getElement()
      .querySelector(`#statistic-${timeframe}`)
      .setAttribute(`checked`, ``);
  }

  _renderContent(count, duration, topGenre) {
    this.statistics = new Statistics(count, duration, topGenre);
    render(this._container, this.statistics.getElement(), Position.BEFOREEND);
    this._subscribeOnEvents();
  }

  _renderChart(map) {
    const ctx = document.querySelector(`.statistic__chart`);
    this._userHistoryChart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(map),
        datasets: [{
          data: Object.values(map),
          backgroundColor: `#ffe800`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 28,
              weight: `bold`,
            },
            color: `#fff`,
            align: `start`,
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: `#fff`,
              fontSize: 24,
              padding: 50,
            }
          }],
        }
      }
    });
  }

  _render(timeframeCurrent) {
    this._renderContent(this._currentValues.count, this._currentValues.duration, this._currentValues.topGenre);
    this._renderChart(this._currentValues.genresMap);
    this._markCurrentTimeframe(timeframeCurrent);
  }

  _onTimeframeClick(e) {
    const timeframe = e.target.previousElementSibling.value;
    if (timeframe !== Stats.TIMEFRAME_DEFAULT) {
      this._removePrevStatistics();
      this._setCurrentValues(this._getFilmsTimeframe(Stats.MILLISECONDS[timeframe]));
      this._render(timeframe);
      this.statistics.getElement().classList.remove(`visually-hidden`);
    } else {
      this._removePrevStatistics();
      this._setCurrentValues(this._films);
      this._render(timeframe);
      this.statistics.getElement().classList.remove(`visually-hidden`);
    }
  }
}
