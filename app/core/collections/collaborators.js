module.exports = Zeppelin.Collection.extend({
  model: require('core/models/collaborator'),

  comparator: function(collaborator) {
    return collaborator.get('date_created');
  },

  setCurrent: function(id) {
    this.current = this.find(function(collaborator) {
      return collaborator.get('user') === id;
    });

    return this;
  },

  getCollaboratorData: function(id) {
    var collaborator = this.find(function(collaborator) {
      return collaborator.get('user') === id;
    });

    return collaborator ? collaborator.get('user_data') : {};
  },

  invite: function(collaborators) {
    return $.post(this.url, JSON.stringify(collaborators), _.bind(function(response) {
      this.add(response);
    }, this));
  }
});
