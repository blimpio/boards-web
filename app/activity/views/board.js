var Board = require('account/views/board');

module.exports = Board.extend({
  template: require('activity/templates/board'),

  onClick: function(event) {
    if (!event.metaKey) {
      event.preventDefault();

      this.model.select({
        navigate: true,
        location: 'activity'
      });

      this.broadcast('board:clicked', this.model);
    }
  },
});

