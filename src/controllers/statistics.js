import Statistics from '../components/statistics/statistics';
import {Position, render, getMax, getRandSelection} from '../utils';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class StatisticsController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._statistics = null;
    this._count = null;
    this._duration = null;
    this._genresUnique = null;
    this._genresMap = {};
    this._topGenre = null;
  }

  _getValues() {
    // Count
    this._count = this._films.length;

    // Duration
    this._films.forEach((el) => {
      this._duration += el.duration;
    });

    // Unique genres
    const genres = [];
    this._films.forEach((el) => genres.push(...el.genres));
    const genresUnique = new Set(genres);
    this._genresUnique = [...genresUnique];

    // Count by genre
    this._genresUnique.forEach((genre) => {
      this._genresMap[genre] = this._films.filter((film) => [...film.genres].includes(genre)).length;
    });

    // Top genre
    this._topGenre = getRandSelection(getMax(this._genresMap), 1);
  }

  _renderStatistics() {
    this._statistics = new Statistics(this._count, this._duration, this._topGenre);
    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
  }

  _renderChart() {
    const ctx = document.querySelector(`.statistic__chart`);
    const userHistoryChart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._genresMap),
        datasets: [{
          data: Object.values(this._genresMap),
          backgroundColor: `#ffe800`,
          defaultFontColor: `red`,
        }]
      },
      options: {
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
        }
      }
    });
  }

  init() {
    this._getValues();
    this._renderStatistics();
    this._renderChart();
  }
}
