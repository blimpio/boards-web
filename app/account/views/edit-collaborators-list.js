module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'edit-collaborators-list list-unstyled',

  itemView: require('account/views/edit-collaborator'),

  loadingTemplate: function() {
    return 'Fetching collaborators...';
  },

  collection: function() {
    return App.BoardCollaborators;
  }
});

