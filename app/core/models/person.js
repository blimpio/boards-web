module.exports = Zeppelin.Model.extend({
  getFullName: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }
});
