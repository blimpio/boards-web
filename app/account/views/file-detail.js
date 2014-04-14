module.exports = Zeppelin.ModelView.extend({
  attributes: {
    'data-type': 'file'
  },

  className: function() {
    var className = 'card is-detail';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  elements: {
    preview: 'img.card-preview'
  },

  template: require('account/templates/file-detail'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getLargePreview()
    });
  },

  initialize: function() {
    _.bindAll(this, ['onPreviewLoaded']);
  },

  onRender: function() {
    this.getElement('preview').load(this.onPreviewLoaded);
  },

  onPreviewLoaded: function(event) {
    _.delay(_.bind(function() {
      this.$el.addClass('has-loaded-preview');
    }, this), 1);
  }
});

