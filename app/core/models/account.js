module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      created_by: App.User.id,
      modified_by: App.User.id
    };
  },

  url: function() {
    var url = '/api/accounts/';
    return this.isNew() ? url : url + this.id + '/';
  },

  getUrl: function() {
    return '/' + this.get('slug') + '/';
  }
});
