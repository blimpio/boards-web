module.exports = Zeppelin.Collection.extend({
  url: App.API_URL + '/cards/',

  model: function(attrs, options) {
    var Model;

    switch(attrs.type) {
      case 'file':
        Model = require('core/models/file');
        break;
      default:
        Model = require('core/models/card');
    }

    return new Model(attrs, options);
  },

  subscriptions: {
    'card:created': 'onCardCreated'
  },

  previewTimer: null,

  comparator: function(model) {
    return -model.get('position');
  },

  initialize: function() {
    this.on('remove', this.onRemove, this);
    this.on('change:is_selected', this.onCardSelected, this);
    this.on('change:thumbnail_sm_path', this.onPreviewChange, this);
  },

  getNewest: function() {
    return this.find(function(card) {
      return card.get('position') === _.max(this.pluck('position'));
    }, this);
  },

  isNewest: function(card) {
    return card.get('position') >= _.max(this.pluck('position'));
  },

  setCurrent: function(slug) {
    this.current = _.first(this.where({slug: slug}));
    return this;
  },

  setPosition: function(card) {
    var position = 0;
        positions = this.pluck('position');

    position = positions.length ? _.max(positions) + 1 : position;
    card.set('position', position);
    return this;
  },

  triggerBoardThumbnailChange: function(board, thumbnail) {
    var self = this;

    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(function() {
      self.broadcast('cards:new:preview', board, thumbnail);
    }, 1000);
  },

  onRemove: function(removed) {
    var card, board, thumbnail;

    if (!removed.isFile()) return;

    card = this.getNewest(),
    board = card.get('board'),
    thumbnail = card.get('thumbnail_sm_path');

    this.triggerBoardThumbnailChange(board, thumbnail);
  },

  onCardCreated: function(card) {
    if (Z.Util.isModel(card)) {
      this.setPosition(card);
      this.add(card);
    }
  },

  onCardSelected: function(card, value) {
    var previouslySelected = this.find(function(_card) {
      return _card.get('is_selected') && _card.cid !== card.cid;
    });

    if (previouslySelected) {
      previouslySelected.set('is_selected', false, {
        silent: true
      }).trigger('deselected');
    }

    this.current = card;
    this.trigger('change:current', this.current);
  },

  onPreviewChange: function(card, thumbnail) {
    if (this.isNewest(card)) {
      this.triggerBoardThumbnailChange(card.get('board'), thumbnail);
    }
  }
});
