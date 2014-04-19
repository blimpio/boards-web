module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: 'board',

  template: require('account/templates/board'),

  events: {
    'click a.board-link': 'onClick'
  },

  elements: {
    name: 'strong.board-name'
  },

  bindings: {
    model: {
      'selected': 'onSelected',
      'deselected': 'onDeselected',
      'change:name': 'onNameChange'
    }
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      url: this.model.getUrl(),
      avatar: this.model.getAvatar()
    });
  },

  updateName: function(name) {
    this.getElement('name').text(name);
    return this;
  },

  onClick: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      this.model.select();
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
  }
});

