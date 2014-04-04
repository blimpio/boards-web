module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'card-detail-info';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  template: require('public-board/templates/card-detail-info'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created')),
      creator: this.options.creator
    });
  }
});

