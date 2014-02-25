module.exports = Zeppelin.Model.extend({
  name: 'App',

  initialize: function() {
    this.fetchCache();
  }
});
