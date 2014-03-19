module.exports = Zeppelin.Collection.extend({
  name: 'Comments',

  model: require('models/comment'),

  fetchComments: function(card) {
    var $d = $.Deferred();

    $.getJSON('/api/cards/' + card + '/comments/').done(_.bind(function(comments) {
      this.reset(comments);
      $d.resolve(arguments);
    }, this)).fail(function() {
      $d.reject(arguments);
    });

    return $d.promise();
  }
});
