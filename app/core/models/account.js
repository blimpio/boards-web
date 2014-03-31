module.exports = Zeppelin.Model.extend({
  getUrl: function() {
    return '/' + this.get('slug') + '/';
  }
});
