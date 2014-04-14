module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: function() {
    var className = 'card is-item';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  events: {
    'click': 'onClick',
    'click [data-action=delete]': 'delete',
    'click [data-action=highlight]': 'toggleHighlight'
  },

  elements: {
    'name': 'span.card-name'
  },

  bindings: {
    model: {
      'change:name': 'onNameChange',
      'change:featured': 'onFeaturedChange'
    }
  },

  delete: function(event) {
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete card?')) {
      this.model.destroy();
      this.broadcast('cardsList:layout');
    }
  },

  updateName: function(value) {
    this.getElement('name').text(value);
    return this;
  },

  toggleHighlight: function(event) {
    event.stopPropagation();
    this.model.save({featured: !this.model.get('featured')});
    return this;
  },

  onClick: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      this.model.select();
    }
  },

  onFeaturedChange: function(card, isFeatured) {
    this.$el.data('width', '');
    this.$el.data('height', '');
    this.$el.removeAttr('style');
    this.$el.removeAttr('data-width');
    this.$el.removeAttr('data-height');
    this.$el.toggleClass('is-featured', isFeatured);
    this.broadcast('cardsList:layout');
  },

  onNameChange: function(card, value) {
    this.updateName(value);
  }
});

