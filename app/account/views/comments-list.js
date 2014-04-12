module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'comments-list list-unstyled',

  itemView: require('account/views/comment'),

  emptyTemplate: require('account/templates/empty-comments'),

  collection: function() {
    return App.Comments;
  },

  addMethod: 'prepend'
});

