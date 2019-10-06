export default class ModelComment {
  constructor(dataComment) {
    this.id = dataComment[`id`];
    this.author = dataComment[`author`];
    this.text = dataComment[`comment`];
    this.time = dataComment[`date`];
    this.emoji = dataComment[`emotion`];
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'author': data.author,
      'comment': data.text,
      'date': data.time,
      'emotion': data.emoji,
    };
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }
}
