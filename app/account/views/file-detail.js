module.exports = Zeppelin.ModelView.extend({
  attributes: {
    'data-type': 'file'
  },

  className: function() {
    var className = 'card is-detail';
    if (this.model.hasPreview()) className += ' has-preview';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  events: {
    'click [data-action=view-original]': 'onViewOriginalClick'
  },

  elements: {
      preview: 'div.card-preview',
      previewLoader: 'img.card-preview-loader',
      previewWrapper: 'div.card-preview-wrapper'
  },

  bindings: {
    model: {
      'change:thumbnail_lg_path': 'onUpdatePreview'
    }
  },

  template: require('account/templates/file-detail'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getPreview(true),
      hasPreview: this.model.hasPreview()
    });
  },

  initialize: function() {
    _.bindAll(this, ['onPreviewLoaded']);
  },

  setPreview: function() {
    var context = {
          preview: this.model.getPreview(true) ,
          hasPreview: this.model.hasPreview()
        },
        template = require('account/templates/file-detail-preview');

    this.getElement('previewWrapper').html(
      this.renderTemplate(template, context)
    );

    this.addElements({
      preview: 'div.card-preview',
      previewLoader: 'img.card-preview-loader'
    });

    this.preloadPreview();
  },

  preloadPreview: function() {
    if (this.getElement('previewLoader')[0].complete) {
      this.onPreviewLoaded();
    } else {
      this.getElement('previewLoader').one('load', this.onPreviewLoaded);
    }
  },

  viewOriginal: function() {
    this.model.originalThumbnail().done(function(data) {
      window.location.replace(data.original_thumbnail_url);
    });
  },

  onRender: function() {
    this.preloadPreview();
  },

  onPreviewLoaded: function() {
    var $el = this.$el,
        $image = this.getElement('previewLoader');

    setTimeout(function() {
      if ($image[0].complete && $image.attr('src')) {
        $el.addClass('has-loaded-preview');
      }
    }, 0);
  },

  onUpdatePreview: function() {
    this.setPreview();
  },

  onViewOriginalClick: function(event) {
    event.preventDefault();
    this.viewOriginal();
  },
});

