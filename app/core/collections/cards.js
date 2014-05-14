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

  getNewestFile: function() {
    var files = this.where({type: 'file'});

    return _.find(files, function(file) {
      var max = _.max(_.pluck(_.pluck(files, 'attributes'), 'position'));
      return file.get('position') === max;
    });
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

    if (removed.isFile()) {
      card = this.getNewestFile();

      if (!card) {
        this.triggerBoardThumbnailChange(removed.get('board'), '');
      } else {
        this.triggerBoardThumbnailChange(card.get('board'), card.get('thumbnail_sm_path'));
      }
    }
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
    if (this.isNewest(card) && card.isFile()) {
      this.triggerBoardThumbnailChange(card.get('board'), thumbnail);
    }
  }
});
