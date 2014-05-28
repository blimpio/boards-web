module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'card-detail-info';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  template: require('public-board/templates/card-detail-info'),

  context: function() {
    var author,
        authorId = this.model.get('created_by');

    this.request('collaborator:info', authorId, function(info) {
      author = info;
    });

    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created')),
      author: author
    });
  },
});

