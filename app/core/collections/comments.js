module.exports = Zeppelin.Collection.extend({
  model: require('core/models/comment'),

  subscriptions: {
    'comment:created': 'onCommentCreated'
  },

  card: null,

  comparator: function(board) {
    return new Date(board.get('date_created')).getTime();
  },

  initialize: function() {
    this.on('remove', function() {
      this.broadcast('update:commentCount', this.card, 'subtract');
    }, this);
  },

  fetchComments: function(cardId) {
    var $d = $.Deferred();

    this.card = cardId;

    $.getJSON(App.API_URL + '/cards/' + cardId + '/comments/').done(_.bind(function(comments) {
      this.reset(comments);
      $d.resolve(arguments);
    }, this)).fail(function() {
      $d.reject(arguments);
    });

    return $d.promise();
  },

  onCommentCreated: function(comment) {
    if (Z.Util.isModel(comment)) {
      this.add(comment);
      this.broadcast('update:commentCount', this.card, 'add');
    }
  }
});
