var BoardsList = require('account/views/boards-list');

module.exports = BoardsList.extend({
  itemView: require('activity/views/board')
});

