module.exports = Zeppelin.Collection.extend({
  name: 'Comments',

  model: require('core/models/comment'),

  subscriptions: {
    'comment:created': 'onCommentCreated'
  },

  fetchComments: function(cardId) {
    var $d = $.Deferred();

    $.getJSON('/api/cards/' + cardId + '/comments/').done(_.bind(function(comments) {
      this.reset(comments);
      $d.resolve(arguments);
    }, this)).fail(function() {
      $d.reject(arguments);
    });

    return $d.promise();
  },

  onCommentCreated: function(comment) {
    if (Z.Util.isModel(comment)) this.add(comment);
  }
});
