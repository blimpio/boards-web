module.exports = Zeppelin.Collection.extend({
  url: '/api/boards/',

  model: require('core/models/board'),

  subscriptions: {
    'board:created': 'onBoardCreated',
    'boards:current': 'respondWithCurrentBoard'
  },

  comparator: function(board) {
    return -(new Date(board.get('date_modified')).getTime());
  },

  initialize: function() {
    this.on('remove', this.onBoardRemoved, this);
    this.on('change:is_selected', function(board, isSelected) {
      if (isSelected) this.onBoardSelected(board, isSelected);
    }, this);
  },

  onBoardCreated: function(board) {
    if (Z.Util.isModel(board)) {
      this.add(board);
      if (this.length === 1) {
        if (board.id) {
          board.select();
        } else {
          board.once('sync', function() {
            this.select();
          }, board);
        }
      }
    }
  },

  onBoardRemoved: function(board) {
    if (!this.isEmpty()) {
      this.at(0).select();
    } else {
      this.current = null;
    }
  },

  onBoardSelected: function(board, value) {
    var previouslySelected = this.find(function(_board) {
      return _board.get('is_selected') && _board.cid !== board.cid;
    });

    if (previouslySelected) previouslySelected.deselect();

    this.current = board;
    this.trigger('change:current', this.current);
  },

  respondWithCurrentBoard: function(channel) {
    this.broadcast(channel, this.current);
  }
});
