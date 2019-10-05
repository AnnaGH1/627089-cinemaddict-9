import ModelFilm from '../model/model-film';
import ModelComment from '../model/model-comment';

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
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static toJSON(response) {
    return response.json();
  }
}
