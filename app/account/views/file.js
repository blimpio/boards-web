var Card = require('account/views/card');

module.exports = Card.extend({
  className: function() {
    var className = Card.prototype.className.apply(this, arguments);
    className += ' has-loaded-preview';
    if (this.model.hasPreview()) className += ' has-preview';
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
        'change:is_uploading': function(file, isUploading) {
          var isFeatured = file.get('featured');

          this.$el.toggleClass('is-uploading', isUploading);

          if (!isUploading) {
            this.broadcast('cardsList:updateBlock', {
              block: this.$el,
              width: isFeatured ? 461 : 223,
              height: isFeatured ? 461 : 223
            });
          }
        },
        'change:upload_progress': function(file, progress) {
          if (this.isRendered) {
            this.updateUploadProgress(progress);
          }
        },
        'change:thumbnail_sm_path': function(file, thumbnail) {
          if (file.previous('thumbnail_sm_path') === null) {
            this.setPreview();
          }
        }
      }
    }, Card.prototype.bindings);
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getPreview(),
      hasPreview: this.model.hasPreview()
    });
  },

  toggleHighlight: function(event) {
    Card.prototype.toggleHighlight.apply(this, arguments);
    if (this.model.hasPreview()) this.setPreview();
    return this;
  },

  setPreview: function() {
    var context = {
          preview: this.model.getPreview(),
          hasPreview: this.model.hasPreview()
        },
        template = require('account/templates/file-preview');

    this.getElement('previewWrapper').html(
      this.renderTemplate(template, context)
    );

    this.addElements({
      preview: 'div.card-preview',
      previewLoader: 'img.card-preview-loader'
    });
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
  }
});
