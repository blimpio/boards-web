module.exports = Zeppelin.Controller.extend({
  name: 'SignoutController',

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});
    this.user.signout();
    this.redirect('signin');
  }
});
