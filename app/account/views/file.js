var Card = require('account/views/card');

module.exports = Card.extend({
  className: function() {
    var className = Card.prototype.className.apply(this, arguments);
    if (this.model.get('is_uploading')) className += ' is-uploading';
    return className;
  },

  template: require('account/templates/file'),

  elements: function() {
    return _.merge({
      preview: 'div.card-preview',
      uploadLoader: 'path.file-loader-fill',
      previewLoader: 'img.card-preview-loader',
      previewWrapper: 'div.card-preview-wrapper',
      uploadProgress: 'text.file-loader-text',
      uploadLoaderBorder: 'path.file-loader-border'
    }, Card.prototype.elements);
  },

  bindings: function() {
    return _.merge({
      model: {
        'change:is_uploading': 'onUploadingStateChange',
        'change:upload_progress': 'onUploadProgress',
        'change:thumbnail_sm_path': 'onUpdatePreview'
      }
    }, Card.prototype.bindings);
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getPreview(),
      extension: this.model.getExtension(),
      hasPreview: this.model.hasPreview()
    });
  },

  initialize: function() {
    _.bindAll(this, ['onPreviewLoaded']);
  },

  toggleHighlight: function(event) {
    Card.prototype.toggleHighlight.apply(this, arguments);
    this.updatePreview();
    return this;
  },

  preloadPreview: function() {
    if (this.getElement('previewLoader')[0].complete) {
      this.onPreviewLoaded();
    } else {
      this.getElement('previewLoader').one('load', this.onPreviewLoaded);
    }
  },

  updatePreview: function() {
    this.getElement('preview').css({
      'background-image': 'url(' + this.model.getPreview() + ')'
    });

    if (this.model.hasPreview()) this.$el.addClass('has-loaded-preview');
    return this;
  },

  updateUploadProgress: function(progress) {
    this.drawProgress(progress * 3.6);
    this.getElement('uploadProgress').text(progress + '%');

    if (progress > 9) {
      this.getElement('uploadProgress').attr('x', 70);
    } else if (progress === 100) {
      this.getElement('uploadProgress').attr('x', 60);
    }

    return this;
  },

  drawProgress: function(a) {
    var r, x, y, mid, anim;

    a %= 360;
    r = (a * Math.PI / 180);
    x = Math.sin(r) * 125;
    y = Math.cos(r) * - 125;
    mid = (a > 180) ? 1 : 0;
    anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';
    this.getElement('uploadLoaderBorder').attr('d', anim);
  },

  onRender: function() {
    if (this.model.hasPreview()) this.preloadPreview();
  },

  onUploadingStateChange: function(file, isUploading) {
    this.$el.toggleClass('is-uploading', isUploading);
  },

  onUploadProgress: function(file, progress) {
    if (this.isRendered) this.updateUploadProgress(progress);
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
    var context = { preview: this.model.getPreview() },
        template = require('account/templates/file-preview');

    this.getElement('previewWrapper').html(
      this.renderTemplate(template, context)
    );

    this.addElements({
      preview: 'div.card-preview',
      previewLoader: 'img.card-preview-loader'
    });

    this.getElement('preview')
      .toggleClass('is-data-url', this.model.previewIsDataUrl());

    this.preloadPreview();
  }
});
