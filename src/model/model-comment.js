export default class ModelComment {
  constructor(dataComment) {
    this.id = dataComment[`id`];
    this.author = dataComment[`author`];
    this.text = dataComment[`comment`];
    this.date = dataComment[`date`];
    this.emoji = dataComment[`emotion`];
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }
}
