var Collaborators = require('core/collections/collaborators');

module.exports = Collaborators.extend({
  url: '/api/boards/collaborators/',

  searchableAttributes: ['user.first_name', 'user.last_name',
  'user.username', 'user.email'],

  initialize: function() {
    this.on('add sync reset change remove', _.debounce(function() {
      this.rebuildIndex();
    }, 150), this);
  },

  rebuildIndex: function(options) {
    var searchableCollaborators;

    options = options || {keys: this.searchableAttributes};

    this.request('boardCollaborators:collaborators', function(collaborators) {
      searchableCollaborators = this.filter(function(collaborator) {
        return _.indexOf(_.pluck(collaborators, 'id'), collaborator.id) === -1;
      });
    });

    this._fuse = new Fuse(_.pluck(searchableCollaborators, 'attributes'), options);
    return this;
  },

  search: function(query) {
    return this._fuse.search(query);
  }
});
