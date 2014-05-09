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

  updateContent: function(value) {
    this.getElement('content').html(_.markdown(value));
    return this;
  },

  onContentChange: function(note, value) {
    this.updateContent(value);
  }
});
