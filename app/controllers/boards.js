module.exports = Zeppelin.View.extend({
  name: 'BoardsController',

  template: require('templates/boards'),

  initialize: function() {
    document.title = 'Blimp | Boards';

    this.user = _.getModel('User');
    this.user.fetchCache();

    if (!this.user.isSignedIn()) {
      this.publish('router:navigate', 'signin');
    } else {
      this.insert('#application');
    }
  }
});
