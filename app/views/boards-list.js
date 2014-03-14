module.exports = Zeppelin.CollectionView.extend({
  name: 'BoardsList',

  el: 'div.sidebar',

  list: 'ol.boards-list',

  className: 'boards',

  template: require('templates/boards'),

  events: {
    'click button[data-action=create]': 'onCreateClick'
  },

  collection: App.Boards,

  itemView: require('views/board'),

  onCreateClick: function() {
    this.showForm();
    return this;
  },

  showForm: function() {
    if (this.hasView('createForm')) {
      this.getView('createForm').$el.show();
    } else {
      this.registerView(_.createView('create-board', {
        currentAccount: this.currentAccount
      }), 'createForm');

      this.listenTo(this.getView('createForm'), 'new:board', this.onNewBoard);
      this.getView('createForm').render();
    }

    return this;
  },

  onNewBoard: function(board) {
    this.collection.add(board);
    return this;
  },

  selectBoard: function(board) {
    var view = this.getItem(board);
    if (view) view.select();
    return this;
  },

  onRemoveItem: function(itemView) {
    if (itemView) itemView.remove();
    return this;
  }
});
