var Board = require('account/views/board');

module.exports = Board.extend({
  onClick: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      this.model.select({navigate: false});
      this.broadcast('board:clicked', this.model);
    }
  },
});

