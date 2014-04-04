module.exports = Zeppelin.Model.extend({
  url: function() {
    var url = '/api/accounts/';
    return this.isNew() ? url : url + this.id + '/';
  },

  getUrl: function() {
    return '/' + this.get('slug') + '/';
  }
});
