var Card = require('account/views/card');

module.exports = Card.extend({
  attributes: function() {
    return {
      'title': this.model.get('name'),
      'data-type': 'note'
    };
  },

  template: require('account/templates/note')
});
