import ModelFilm from '../model/model-film';
import ModelComment from '../model/model-comment';
import {RESPONSE_STATUS} from './const';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({
      url: `movies`
    })
      .then(API.toJSON)
      .then(ModelFilm.parseFilms);
  }

  getComments(filmId) {
    return this._load({
      url: `comments/${filmId}`
    })
      .then(API.toJSON)
      .then(ModelComment.parseComments);
  }

  updateFilm(id, data) {
    const dataRaw = ModelFilm.toRAW(data);
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(dataRaw),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    })
      .then(API.toJSON)
      .then(ModelFilm.parseFilm);
  }

  updateRating(id, data) {
    const dataRaw = ModelFilm.toRAW(data);
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(dataRaw),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    })
      .then(API.toJSON)
      .then(ModelFilm.parseFilm);
  }

  createComment(data, filmId) {
    const dataRaw = ModelComment.toRAW(data);
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(dataRaw),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    })
      .then(API.toJSON)
      .then(ModelComment.parseComment);
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  static checkStatus(response) {
    if (response.status >= RESPONSE_STATUS.SUCCESS.MIN && response.status <= RESPONSE_STATUS.SUCCESS.MAX) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  static toJSON(response) {
    return response.json();
  }
}
