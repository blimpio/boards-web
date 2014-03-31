module.exports = Zeppelin.Collection.extend({
  url: '/api/boards/',

  model: require('core/models/board'),

  subscriptions: {
    'board:created': 'onBoardCreated',
    'boards:current': 'sendCurrent'
  },

  comparator: function(board) {
    return -(new Date(board.get('date_modified')).getTime());
  },

  initialize: function() {
    this.on('remove', this.onBoardRemoved, this);
    this.on('change:is_selected', this.onBoardSelected, this);
  },

  onBoardCreated: function(board) {
    if (Z.Util.isModel(board)) this.add(board);
  },

  onBoardRemoved: function(board) {
    this.at(0).select();
  },

  onBoardSelected: function(board, value) {
    var previouslySelected = this.find(function(_board) {
      return _board.get('is_selected') && _board.cid !== board.cid;
    });

    if (previouslySelected) {
      previouslySelected.set('is_selected', false, {
        silent: true
      }).trigger('deselected');
    }

    this.current = board;
    this.trigger('change:current', this.current);
  },

  sendCurrent: function(channel) {
    this.broadcast(channel, this.current);
  }
});
