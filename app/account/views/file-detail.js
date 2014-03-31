module.exports = Zeppelin.ModelView.extend({
  attributes: {
    'data-type': 'file'
  },

  className: function() {
    var className = 'card is-detail';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  template: require('account/templates/file-detail'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getLargePreview()
    });
  }
});

