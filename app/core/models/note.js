var Card = require('core/models/card');

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'note'
    }, Card.prototype.defaults);
  }
});
