module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  attributes: function() {
    return {
      'title': this.model.get('name'),
      'data-type': this.model.get('type')
    };
  },

  className: function() {
    var className = 'card is-item';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  events: {
    'click': 'onClick',
    'click a.card-link': 'onClickLink',
    'click [data-action=delete]': 'delete',
    'click [data-action=highlight]': 'toggleHighlight'
  },

  elements: {
    'name': 'div.card-name',
    'comments': 'div.card-comments'
  },

  bindings: {
    model: {
      'change:name': function(card, name) {
        this.updateName(name);
      },
      'change:featured': 'onFeaturedChange',
      'change:comments_count': function(card, count) {
        this.updateCommentsCount(count);
      }
    }
  },

  delete: function(event) {
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this card?')) {
      this.model.destroy();
      this.broadcast('cardsList:layout');
    }

    return this;
  },

  updateName: function(name) {
    this.getElement('name').text(name);
    return this;
  },

  updateCommentsCount: function(count) {
    this.getElement('comments').text(count + (count === 1 ? ' comment' : ' comments'));
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

  onClickLink: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
    }
  },

  onFeaturedChange: function(card, isFeatured) {
    this.$el.toggleClass('is-featured', isFeatured);

    this.broadcast('cardsList:updateBlock', {
      block: this.$el,
      width: isFeatured ? 461 : 223,
      height: isFeatured ? 461 : 223
    });
  }
});

