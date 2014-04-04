var CardsList = require('account/views/cards-list');

module.exports = CardsList.extend({
  className: 'cards-list is-public list-unstyled clearfix',

  itemView: function(model) {
    return require('public-board/views/' + model.get('type'));
  }
});

