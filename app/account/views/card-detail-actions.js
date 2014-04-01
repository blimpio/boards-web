module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'card-detail-actions';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  template: function(context) {
    var type = this.model.get('type'),
        template = require('account/templates/' + type + '-detail-actions');

    return template(context);
  },

  events: {
    'click [data-action=back]': 'onClickBack',
    'click [data-action=edit]': 'edit',
    'click [data-action=delete]': 'delete',
    'click [data-action=highlight]': 'toggleHighlight',
    'click [data-action=download]': 'download'
  },

  bindings: {
    model: {
      'change:featured': 'onFeaturedChange'
    }
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      boardUrl: this.options.boardUrl,
      boardName: this.options.boardName
    });
  },

  onClickBack: function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      this.model.set('is_selected', false, {
        silent: true
      }).trigger('deselected');
      this.broadcast('cardDetail:closed');
      this.broadcast('router:navigate', $(event.currentTarget).attr('href'), {
        trigger: false
      });
    }
  },

  edit: function() {
    this.broadcast('note:edit');
  },

  toggleHighlight: function() {
    this.model.save({featured: !this.model.get('featured')});
    return this;
  },

  delete: function() {
    if (window.confirm('Are you sure you want to delete card?')) {
      this.model.destroy();
    }
  },

  download: function() {
    this.model.download().done(function(data) {
      window.location.replace(data.download_url);
    });
  }
});

