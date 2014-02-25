module.exports = Zeppelin.View.extend({
  name: 'BoardsSidebarItem',

  tagName: 'li',

  className: 'boards-sidebar__boards-item',

  template: require('templates/boards-sidebar-item'),

  events: {
    'click': 'onClick'
  },

  bindings: {
    'model edited': 'onEdited',
    'model destroy': 'remove'
  },

  model: require('models/board'),

  context: function() {
    return this.model.getPresenters(['name', 'thumbnail_sm_path']);
  },

  select: function() {
    this.$el.addClass('is-selected');
    return this;
  },

  onClick: function() {
    this.publish('board:selected', this.model);
    return this;
  },

  onEdited: function(model, changed) {
    if (changed) this.render();
    return this;
  }
});
