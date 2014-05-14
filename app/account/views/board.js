module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: 'board',

  template: require('account/templates/board'),

  events: {
    'click a.board-link': 'onClick'
  },

  elements: {
    link: 'a.board-link',
    name: 'span.board-name',
    thumb: '.board-avatar'
  },

  bindings: {
    model: {
      'sync': 'onSync',
      'selected': 'onSelected',
      'deselected': 'onDeselected',
      'change:name': 'onNameChange',
      'change:thumbnail_sm_path': 'onThumbnailChange'
    }
  },

  partials: {
    'span.board-thumbnail-partial': require('account/templates/board-preview')
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      url: this.model.getUrl()
    });
  },

  updateName: function(name) {
    this.getElement('name').text(name);
    return this;
  },

  updateThumbnail: function(thumbnail) {
    this.renderPartial('span.board-thumbnail-partial', {
      color: this.model.get('color'),
      thumbnail_sm_path: thumbnail
    });
  },

  onSync: function() {
    this.getElement('link').attr('href', this.model.get('html_url'));
  },

  onClick: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      this.model.select();
      this.broadcast('board:clicked', this.model);
    }
  },

  onSelected: function() {
    this.$el.addClass('is-selected');
  },

  onDeselected: function() {
    this.$el.removeClass('is-selected');
  },

  onNameChange: function(board, name) {
    this.updateName(name);
  },

  onThumbnailChange: function(board, thumbnail) {
    this.updateThumbnail(thumbnail);
  }
});

