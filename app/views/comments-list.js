module.exports = Zeppelin.CollectionView.extend({
  name: 'CommentsList',

  el: 'div.comments',

  list: 'ol.comments-list',

  template: require('templates/comments'),

  views: {
    createForm: require('views/create-comment')
  },

  collection: App.Comments,

  itemView: require('views/comment'),

  onRender: function() {
    this.listenTo(this.getView('createForm'), 'new:comment', this.onNewComment);
  },

  onNewComment: function(comment) {
    this.collection.add(comment);
    return this;
  },

  onRemoveItem: function(itemView) {
    if (itemView) itemView.remove();
    return this;
  }
});
