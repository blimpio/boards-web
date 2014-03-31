module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'boards-list list-unstyled',

  itemView: require('account/views/board'),

  addMethod: 'prepend',

  collection: function() {
    return App.Boards;
  },

  onRenderItems: function() {
    this.setListHeight();
  },

  setListHeight: function() {
    this.$list.height($(document).height() - 123);
    return this;
  }
});

