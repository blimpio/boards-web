module.exports = Zeppelin.CollectionView.extend({
  el: 'div.boards__sidebar',

  name: 'BoardsSidebar',

  list: 'ol.boards-sidebar__boards',

  template: require('templates/boards-sidebar'),

  elements: {
    'createBtn': {
      selector: 'button[data-action=createBoard]',

      events: {
        'click': 'onCreateBoardClick'
      }
    }
  },

  subscriptions: {
    'board:selected': 'onBoardSelected'
  },

  itemView: require('views/boards-sidebar-item'),

  collection: App.Boards,

  onCreateBoardClick: function() {
    this.showForm();
    return this;
  },

  showForm: function() {
    if (this.children.form) {
      this.children.form.$el.show();
    } else {
      this.addChild(_.createView('create-board-form', {
        currentAccount: this.currentAccount
      }), 'form');

      this.listenTo(this.children.form, 'new:board', this.onNewBoard);
      this.children.form.render();
    }

    return this;
  },

  onNewBoard: function(board) {
    this.collection.add(board);
    return this;
  },

  onAdd: function(board) {
    this.appendItem(this.renderItem(board));
    return this;
  },

  onBoardSelected: function(board) {
    var child = this.getChild(function(child) {
      return child.model.id === board.id;
    });

    if (child) {
      this.$('li.is-selected').removeClass('is-selected');
      child.select();
    }

    return this;
  }
});
