var Card = require('core/models/card'),
    COLORS = ['#fc9a1b', '#f30059', '#12799c', '#f75213', '#8ac5a8', '#1aab26', '#15a58f'],
    PATTERNS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    usedColors = [],
    usedPatterns = [];

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'file',
      is_uploading: false,
      upload_progress: 0,
      thumbnail_sm_path: null,
      thumbnail_md_path: null,
      thumbnail_lg_path: null
    }, Card.prototype.defaults());
  },

  localAttributes: function() {
    return _.union(
      ['is_uploading', 'upload_progress'], Card.prototype.localAttributes
    );
  },

  parse: function(response) {
    if (!response.thumbnail_xs_path ||
    !response.thumbnail_sm_path ||
    !response.thumbnail_md_path ||
    !response.thumbnail_lg_path && this.hasPreview()) {
      return _.omit(response, ['thumbnail_xs_path', 'thumbnail_sm_path',
      'thumbnail_md_path', 'thumbnail_lg_path']);
    } else {
      return response;
    }
  },

  getExtension: function() {
    return _.last(this.get('name').split('.')) ||
    _.last(this.get('mime_type').split('/'));
  },

  hasPreview: function() {
    return this.get('thumbnail_sm_path') !== null &&
    this.get('thumbnail_md_path') !== null &&
    this.get('thumbnail_lg_path') !== null;
  },

  getSmallPreview: function() {
    return this.get('thumbnail_sm_path');
  },

  getMediumPreview: function() {
    return this.get('thumbnail_md_path');
  },

  getLargePreview: function() {
    return this.get('thumbnail_lg_path');
  },

  getPreview: function(isDetail) {
    isDetail = isDetail || false;

    if (this.hasPreview()) {
      if (isDetail) {
        image = this.getLargePreview();
      } else {
        image = this.get('featured')
          ? this.getMediumPreview()
          : this.getSmallPreview();
      }

      return {
        image: image
      };
    } else {
      if (!this.has('metadata') || !this.get('metadata').pattern) {
        this.generatePattern();
      }

      return {
        color: this.get('metadata').pattern.color,
        pattern: this.get('metadata').pattern.shape,
        extension: this.getExtension()
      };
    }
  },

  generatePattern: function() {
    var data, color, image, pattern, unusedColors, unusedPatterns;

    unusedColors = _.difference(COLORS, usedColors);
    unusedPatterns = _.difference(PATTERNS, usedPatterns);

    if (unusedColors.length) {
      color = unusedColors[_.random(unusedColors.length - 1)]
      usedColors.push(color);
    } else {
      color = COLORS[_.random(COLORS.length - 1)]
      usedColors = [color];
    }

    if (unusedPatterns.length) {
      pattern = unusedPatterns[_.random(unusedPatterns.length - 1)]
      usedPatterns.push(pattern);
    } else {
      pattern = PATTERNS[_.random(PATTERNS.length - 1)]
      usedPatterns = [pattern];
    }

    data = {
      metadata: {
        pattern: {
          color: color,
          shape: pattern
        }
      }
    };

    if (this.isNew()) {
      this.set(data);
    } else {
      this.save(data);
    }

    return this;
  }
});
