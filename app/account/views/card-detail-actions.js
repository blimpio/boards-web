module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'card-detail-actions item-actions';
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
    'click [data-action=download]': 'download'
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      boardUrl: this.options.boardUrl,
      boardName: this.options.boardName,
      boardPreview: this.options.boardPreview
    });
  },

  edit: function() {
    this.broadcast('note:edit');
  },

  delete: function() {
    if (window.confirm('Are you sure you want to delete card?')) {
      this.model.destroy();
    }
  },

  download: function(event) {
    event.preventDefault();

    this.model.download().done(function(data) {
      window.location.replace(data.download_url);
    });
  },

  onClickBack: function(event) {
    if (!event.metaKey) {
      event.preventDefault();

      this.model.set('is_selected', false, {
        silent: true
      }).trigger('deselected');

      this.broadcast('router:navigate', $(event.currentTarget).attr('href'), {
        trigger: false
      });

      this.broadcast('cardDetail:closed');
    }
  }
});

