module.exports = Zeppelin.Collection.extend({
  model: require('core/models/collaborator'),

  comparator: function(collaborator) {
    return collaborator.get('date_created');
  },

  getCollaborator: function(id) {
    return this.find(function(collaborator) {
      return collaborator.hasAccount() && collaborator.get('user').id === id;
    });
  },

  getCollaborators: function(ids) {
    var collaborators = [];

    _.forEach(ids, function(id) {
      collaborators.push(this.getCollaborator(id));
    }, this);

    return _.compact(collaborators);
  },

  invite: function(collaborators) {
    return $.post(this.url, JSON.stringify(collaborators), _.bind(function(response) {
      this.add(response);
    }, this));
  }
});
