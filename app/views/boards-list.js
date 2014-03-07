module.exports = Zeppelin.CollectionView.extend({
  className: 'boards',

  name: 'BoardsList',

  template: require('templates/boards'),

  list: 'ol.boards-list',

  events: {
    'click button[data-action=create]': 'onCreateClick'
  },

  itemView: require('views/board'),

  collection: App.Boards,

  onCreateClick: function() {
    this.showForm();
    return this;
  },

  showForm: function() {
    if (this.children.createForm) {
      this.children.createForm.$el.show();
    } else {
      this.addChild(_.createView('create-board', {
        currentAccount: this.currentAccount
      }), 'createForm');

      this.listenTo(this.children.createForm, 'new:board', this.onNewBoard);
      this.children.createForm.render();
    }

    return this;
  },

  onNewBoard: function(board) {
    this.collection.add(board);
    return this;
  },

  onAdd: function(board) {
    if (!this.isFirstRender) this.appendItem(this.renderItem(board));
    return this;
  },

  onRemove: function(board) {
    var itemView = this.getItemViewByModel(board);
    if (itemView) itemView.remove();
    return this;
  },

  selectBoard: function(board) {
    var boardView = this.getItemViewByModel(board);
    if (boardView) boardView.select();
    return this;
  }
});
