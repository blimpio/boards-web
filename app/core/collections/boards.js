var boardColors = ['#22D1E4', '#80EBF7', '#BCEDF3', '#22E481', '#7AE7B0',
'#AFF1D0', '#EAD20E', '#EBE087', '#EBE6C0', '#EAA211', '#F6C769', '#FFE6B4',
'#E44822', '#EB785C', '#E6AA9B', '#EA0E76', '#ED549C', '#FC9ECA'];

module.exports = Zeppelin.Collection.extend({
  url: App.API_URL + '/boards/',

  model: require('core/models/board'),

  subscriptions: {
    'board:created': 'onBoardCreated',
    'boards:current': 'respondWithCurrentBoard',
    'cards:new:preview': 'onPreviewAvailable'
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

  setCurrent: function(slug) {
    this.current = _.first(this.where({slug: slug}));
    return this;
  },

  assignColor: function(board) {
    var unusedColors;

    unusedColors = _.difference(boardColors, _.compact(this.pluck('color')));
    unusedColors = unusedColors.length ? unusedColors : boardColors;
    board.set('color', unusedColors[_.random(unusedColors.length - 1)]);
    return this;
  },

  onBoardCreated: function(board) {
    var self = this,
        lastSelected = this.current;

    if (Z.Util.isModel(board)) {
      this.assignColor(board);
      this.add(board);

      if (!board.isNew()) {
        board.select();
      } else {
        board.once('sync', function() {
          if (self.current.cid === lastSelected.cid) this.select();
        }, board);
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
  },

  onPreviewAvailable: function(board, preview) {
    this.get(board).save('thumbnail_sm_path', preview);
  }
});
