module.exports = Zeppelin.Collection.extend({
  model: require('core/models/comment'),

  subscriptions: {
    'comment:created': 'onCommentCreated'
  },

  comparator: function(board) {
    return new Date(board.get('date_created')).getTime();
  },

  fetchComments: function(cardId) {
    var $d = $.Deferred();

    $.getJSON(App.API_URL + '/cards/' + cardId + '/comments/').done(_.bind(function(comments) {
      this.reset(comments);
      $d.resolve(arguments);
    }, this)).fail(function() {
      $d.reject(arguments);
    });

    return $d.promise();
  },

  onCommentCreated: function(comment) {
    if (Z.Util.isModel(comment)) this.add(comment);
  },

  addCreatorsData: function(creators) {
    if (!creators.length) return this;

    this.each(function(comment) {
      var creator = _.where(creators, {
        attributes: {
          user: {
            id: comment.get('created_by')
          }
        }
      })[0];

      if (creator) {
        comment.set('creator', {
          name: creator.getName(),
          avatar: creator.getAvatar()
        });
      }
    });

    return this;
  }
});
