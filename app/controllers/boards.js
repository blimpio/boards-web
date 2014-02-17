module.exports = Zeppelin.View.extend({
  name: 'BoardsController',

  template: require('templates/boards'),

  initialize: function() {
    document.title = 'Blimp | Boards';
    this.user = _.getModel('User');
    this.insert('#application');
  }
});
