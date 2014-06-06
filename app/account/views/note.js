var Card = require('account/views/card');

module.exports = Card.extend({
  bindings: function() {
    return _.merge({
      model: {
        'change:content': 'onContentChange'
      }
    }, Card.prototype.bindings);
  },

  elements: function() {
    return _.merge({
      content: 'div.card-content'
    }, Card.prototype.elements);
  },

  template: require('account/templates/note'),

  updateContent: function(content) {
    this.getElement('content').html(_.markdownNoLinks(content));
    return this;
  },

  onContentChange: function(note, content) {
    this.updateContent(content);
  }
});
