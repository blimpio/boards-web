module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'edit-collaborators-list list-unstyled',

  itemView: require('account/views/edit-collaborator'),

  loadingTemplate: function() {
    return 'Fetching collaborators...';
  },

  collection: function() {
    return App.BoardCollaborators;
  },

  _onAdd: function (collaborator) {
    if (collaborator.get('board') === App.Boards.current.id) {
      Z.CollectionView.prototype._onAdd.apply(this, arguments);
    }
  },

  _onRemove: function(collaborator) {
    if (collaborator.get('board') === App.Boards.current.id) {
      Z.CollectionView.prototype._onRemove.apply(this, arguments);
    }
  },

  render: function() {
    Z.View.prototype.render.apply(this, arguments);
    this.setList();
    this.filter(function(collaborator) {
      return collaborator.get('board') === App.Boards.current.id;
    });

    return this;
  },
});

