module.exports = Zeppelin.Controller.extend({
  name: 'BoardsController',

  title: 'Blimp | Boards',

  template: require('templates/boards'),

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});

    if (!this.user.isLoggedIn()) {
      console.log('lkwnflwk');
      this.redirect('login');
    }
  }
});
